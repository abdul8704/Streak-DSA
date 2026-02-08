const leetcodeService = require('./leetcode.service');
const { mapSubmissionCountsByDate } = require('../utils/leetcode.utils');
const userSubmissionQueries = require('../db/queries/user_submission');
const userManagementQueries = require('../db/queries/user_management');
const bcrypt = require('bcrypt');

const syncUserHeatmap = async (userId, handle) => {
    try {
        const heatmapData = await leetcodeService.getLeetcodeHeatMap(handle);

        let updatedDays = 0;
        for (const [dateStr, count] of Object.entries(heatmapData)) {
            // dateStr format from leetcode service is "Day Month Year" e.g. "7 Feb 2026"
            const dateObj = new Date(dateStr);
            const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

            await userSubmissionQueries.insertUserHeatmap(userId, formattedDate, count);
            updatedDays++;
        }
        return updatedDays;
    } catch (error) {
        console.error('Error syncing user heatmap:', error);
        throw error;
    }
}

const syncUserContests = async (userId, handle) => {
    try {
        const contestHistory = await leetcodeService.getLeetcodeContestData(handle);

        // Clear existing contest data for this user/platform to avoid duplicates/stale data
        await userSubmissionQueries.deleteUserContestsByPlatform(userId, 'leetcode');

        let contestsSynced = 0;
        for (const contest of contestHistory) {
            // Only store attended contests
            if (contest.attended) {
                await userSubmissionQueries.insertUserContest(
                    userId,
                    'leetcode',
                    contest.contest.title,
                    contest.ranking,
                    contest.rating,
                    contest.contest.startTime
                );
                contestsSynced++;
            }
        }
        return contestsSynced;
    } catch (error) {
        console.error('Error syncing user contests:', error);
        throw error;
    }
}

const syncUserSubmissions = async (username, leetcodeSession, csrfToken) => {
    try {
        // 0. Fetch LeetCode Handle
        const leetcodeHandle = await userManagementQueries.getUserPlatformHandle(username, 'leetcode');
        const handleToUse = leetcodeHandle || username; // Fallback to username if no handle linked? Or strict? 
        // For full sync with session, maybe username is fine if they haven't linked? 
        // But user said "use this handles as username". Let's prefer handle.

        // 1. Fetch all accepted submissions
        const submissions = await leetcodeService.getLeetcodeAllData(handleToUse, leetcodeSession, csrfToken);

        // Sort by timestamp ascending (earliest first)
        submissions.sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp));

        // 2. Get User ID
        const userId = await userSubmissionQueries.getUserIdByUsername(username);

        if (!userId) {
            throw new Error(`User not found: ${username}`);
        }

        // 3. Insert Solved Problems
        for (const submission of submissions) {
            await userSubmissionQueries.insertUserSolvedProblem(
                userId,
                'leetcode',
                submission.problem_id,
                submission.timestamp
            );
        }

        // 4. Calculate Daily Counts & Heatmap
        const dateMap = mapSubmissionCountsByDate(submissions);
        for (const [dateStr, count] of Object.entries(dateMap)) {
            // dateStr is like "7 Feb 2026"
            const dateObj = new Date(dateStr);
            const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
            await userSubmissionQueries.insertUserHeatmap(userId, formattedDate, count);
        }

        // 5. Calculate Streak Stats
        let maxStreak = 0;
        let currentStreak = 0;
        let highestSolved = 0;

        const sortedDates = Object.keys(dateMap).sort((a, b) => new Date(a) - new Date(b));

        let tempStreak = 0;
        let prevDate = null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const dateStr of sortedDates) {
            const count = dateMap[dateStr];
            if (count > highestSolved) highestSolved = count;

            const currentDate = new Date(dateStr);

            if (prevDate) {
                const diffTime = Math.abs(currentDate - prevDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    tempStreak++;
                } else {
                    tempStreak = 1;
                }
            } else {
                tempStreak = 1;
            }

            if (tempStreak > maxStreak) maxStreak = tempStreak;
            prevDate = currentDate;
        }

        // Check if current streak is active (submitted today or yesterday)
        // If last submission date is before yesterday, current streak is 0.
        if (prevDate) {
            const diffTime = Math.abs(today - prevDate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 1) {
                currentStreak = tempStreak;
            } else {
                currentStreak = 0;
            }
        }

        await userSubmissionQueries.updateUserStreakStats(userId, maxStreak, currentStreak, highestSolved);

        // 6. Sync Contest Data
        // 6. Invoke Separate Sync Services
        const contestsSynced = await syncUserContests(userId, handleToUse);
        const heatmapDaysSynced = await syncUserHeatmap(userId, handleToUse);

        return {
            message: 'Sync successful',
            stats: { maxStreak, currentStreak, highestSolved },
            contests: contestsSynced,
            heatmapDays: heatmapDaysSynced
        };

    } catch (error) {
        console.error('Error syncing user submissions:', error);
        throw error;
    }
}

const createUser = async (username, email, password) => {
    try {
        const exists = await userManagementQueries.checkUserExists(username, email);
        if (exists) {
            throw new Error('User already exists');
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        await userManagementQueries.insertUser(username, email, passwordHash);

        return { message: 'User created successfully' };
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

const addPlatformHandles = async (username, platforms) => {
    try {
        const userId = await userSubmissionQueries.getUserIdByUsername(username);

        if (!userId) {
            throw new Error(`User not found: ${username}`);
        }

        const results = [];
        for (const { platform, handle } of platforms) {
            // Validate platform and handle
            if (!platform || !handle) continue;

            await userManagementQueries.insertUserPlatform(userId, platform, handle);
            results.push({ platform, handle, status: 'Added' });
        }

        return { message: 'Platform handles updated', results };
    } catch (error) {
        console.error('Error adding platform handles:', error);
        throw error;
    }
}

const getUserPlatforms = async (username) => {
    try {
        const platforms = await userManagementQueries.getUserPlatforms(username);
        return platforms;
    } catch (error) {
        console.error('Error fetching user platforms:', error);
        throw error;
    }
}

const syncUserDaily = async (username) => {
    try {
        const userId = await userSubmissionQueries.getUserIdByUsername(username);
        if (!userId) {
            throw new Error(`User not found: ${username}`);
        }

        const leetcodeHandle = await userManagementQueries.getUserPlatformHandle(username, 'leetcode');
        if (!leetcodeHandle) {
            throw new Error(`LeetCode handle not found for user: ${username}`);
        }

        // 1. Fetch Daily (Recent) Submissions
        const recentSubmissions = await leetcodeService.getLeetcodeDaily(leetcodeHandle);

        // 2. Insert Recent Solved Problems
        for (const submission of recentSubmissions) {
            await userSubmissionQueries.insertUserSolvedProblem(
                userId,
                'leetcode',
                submission.problem_id,
                submission.timestamp
            );
        }

        // 3. Sync Heatmap (fetches full calendar from LeetCode)
        const heatmapDaysSynced = await syncUserHeatmap(userId, leetcodeHandle);

        // 4. Sync Contests
        const contestsSynced = await syncUserContests(userId, leetcodeHandle);

        // 5. Recalculate Streak Stats from DB (User Heatmap)
        // We need to query the full heatmap to calculate accurate streak
        const heatmapRows = await userSubmissionQueries.getUserHeatmap(userId);
        // getUserHeatmap returns sorted by date ASC

        let maxStreak = 0;
        let currentStreak = 0;
        let highestSolved = 0;

        let tempStreak = 0;
        let prevDate = null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const row of heatmapRows) {
            const count = row.count_of_solved;
            if (count > highestSolved) highestSolved = count;

            // row.date is likely a Date object from MySQL driver
            const currentDate = new Date(row.date);
            currentDate.setHours(0, 0, 0, 0); // Ensure time is 00:00

            if (prevDate) {
                const diffTime = Math.abs(currentDate - prevDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    tempStreak++;
                } else {
                    tempStreak = 1;
                }
            } else {
                tempStreak = 1;
            }

            if (tempStreak > maxStreak) maxStreak = tempStreak;
            prevDate = currentDate;
        }

        // Check if current streak is active
        if (prevDate) {
            const diffTime = Math.abs(today - prevDate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 1) {
                currentStreak = tempStreak;
            } else {
                currentStreak = 0;
            }
        }

        await userSubmissionQueries.updateUserStreakStats(userId, maxStreak, currentStreak, highestSolved);

        return {
            message: 'Daily sync successful',
            stats: { maxStreak, currentStreak, highestSolved },
            recentSubmissions: recentSubmissions.length,
            heatmapDays: heatmapDaysSynced,
            contests: contestsSynced
        };

    } catch (error) {
        console.error('Error syncing user daily data:', error);
        throw error;
    }
}

const syncContestsByUsername = async (username) => {
    const userId = await userSubmissionQueries.getUserIdByUsername(username);
    if (!userId) {
        throw new Error('User not found');
    }
    const leetcodeHandle = await userManagementQueries.getUserPlatformHandle(username, 'leetcode');
    if (!leetcodeHandle) {
        throw new Error(`LeetCode handle not found for user: ${username}`);
    }
    return syncUserContests(userId, leetcodeHandle);
}

const syncHeatmapByUsername = async (username) => {
    const userId = await userSubmissionQueries.getUserIdByUsername(username);
    if (!userId) {
        throw new Error('User not found');
    }
    const leetcodeHandle = await userManagementQueries.getUserPlatformHandle(username, 'leetcode');
    if (!leetcodeHandle) {
        throw new Error(`LeetCode handle not found for user: ${username}`);
    }
    return syncUserHeatmap(userId, leetcodeHandle);
}

module.exports = {
    syncUserSubmissions,
    syncUserDaily,
    syncUserContests,
    syncUserHeatmap,
    syncContestsByUsername,
    syncHeatmapByUsername,
    createUser,
    addPlatformHandles,
    getUserPlatforms
};
