import TeamMember from "@/models/TeamMember";
import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  console.log('📊 Team Stats API: GET request received');
  console.log('🔗 Request URL:', request.url);

  try {
    console.log('🔌 Attempting database connection...');
    await dbConnect();
    console.log('✅ Database connected successfully');

    // Get all team members for comprehensive stats
    const allMembers = await TeamMember.find({}).lean();

    console.log('✅ Retrieved team members for stats:', allMembers.length);

    // Basic counts
    const totalMembers = allMembers.length;
    const activeMembers = allMembers.filter(member => member.isMember).length;
    const inactiveMembers = totalMembers - activeMembers;

    // Role-based stats
    const roleStats = {
      HOD: allMembers.filter(member => member.Role === 'HOD').length,
      Coordinator: allMembers.filter(member => member.Role === 'Coordinator').length,
      AssistantCoordinator: allMembers.filter(member => member.Role === 'Assistant Coordinator').length,
    };

    // Department stats
    const departmentStats = {};
    allMembers.forEach(member => {
      const dept = member.department || 'Unknown';
      departmentStats[dept] = (departmentStats[dept] || 0) + 1;
    });

    // Year-wise stats
    const yearStats = {};
    allMembers.forEach(member => {
      const year = member.year || 'Unknown';
      yearStats[year] = (yearStats[year] || 0) + 1;
    });

    // Course stats
    const courseStats = {};
    allMembers.forEach(member => {
      const course = member.course || 'Unknown';
      courseStats[course] = (courseStats[course] || 0) + 1;
    });

    // Branch stats
    const branchStats = {};
    allMembers.forEach(member => {
      const branch = member.branch || 'Unknown';
      branchStats[branch] = (branchStats[branch] || 0) + 1;
    });

    // Activity stats
    const activityStats = {
      activeInActivities: allMembers.filter(member => member.activity).length,
      notActiveInActivities: allMembers.filter(member => !member.activity).length,
    };

    // Alumni stats
    const alumniStats = {
      currentStudents: allMembers.filter(member => !member.isAlumni).length,
      alumni: allMembers.filter(member => member.isAlumni).length,
    };

    // Recent additions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentAdditions = allMembers.filter(member =>
      new Date(member.createdAt) > thirtyDaysAgo
    ).length;

    // Gender distribution (if available in future)
    // For now, we'll skip this as it's not in the current model

    // Comprehensive stats object
    const stats = {
      overview: {
        totalMembers,
        activeMembers,
        inactiveMembers,
        recentAdditions,
      },
      roles: roleStats,
      departments: departmentStats,
      years: yearStats,
      courses: courseStats,
      branches: branchStats,
      activities: activityStats,
      alumni: alumniStats,
      // Derived stats
      derived: {
        leads: roleStats.HOD,
        coreMembers: roleStats.Coordinator + roleStats.AssistantCoordinator,
        visibleMembers: activeMembers,
        featuredMembers: roleStats.HOD,
        currentYearMembers: yearStats[new Date().getFullYear()] || 0,
      }
    };

    console.log('📊 Stats calculated successfully:', {
      totalMembers,
      activeMembers,
      roles: roleStats,
      departmentsCount: Object.keys(departmentStats).length
    });

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching team stats:", {
      error: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });

    console.log('💥 Internal server error, returning 500');
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}