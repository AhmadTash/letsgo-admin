'use client';

import * as React from 'react';
import { useMemo } from 'react';
import Grid from '@mui/material/Unstable_Grid2';

import { TotalStudents } from '@/components/dashboard/overview/total-students';
import { TotalTrainers } from '@/components/dashboard/overview/total-trainers';
import { TotalJobs } from '@/components/dashboard/overview/total-jobs';
import { TotalSchools } from '@/components/dashboard/overview/total-schools';
import { useGetStudentsQuery, useGetTrainersQuery, useGetJobsQuery, useGetSchoolsQuery } from '@/store';

/**
 * Format a number to a compact string (e.g., 1600 -&gt; "1.6k", 24 -&gt; "24")
 */
function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

export default function Page(): React.JSX.Element {
  const { data: studentsData, isLoading: isLoadingStudents } = useGetStudentsQuery();
  const { data: trainersData, isLoading: isLoadingTrainers } = useGetTrainersQuery();
  const { data: jobsData, isLoading: isLoadingJobs } = useGetJobsQuery();
  const { data: schoolsData, isLoading: isLoadingSchools } = useGetSchoolsQuery();

  const studentsCount = useMemo(() => {
    return studentsData?.students?.length || 0;
  }, [studentsData]);

  const trainersCount = useMemo(() => {
    return trainersData?.trainers?.length || 0;
  }, [trainersData]);

  const jobsCount = useMemo(() => {
    return jobsData?.jobs?.length || 0;
  }, [jobsData]);

  const schoolsCount = useMemo(() => {
    return schoolsData?.schools?.length || 0;
  }, [schoolsData]);

  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <TotalStudents sx={{ height: '100%' }} value={formatNumber(studentsCount)} loading={isLoadingStudents} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalTrainers sx={{ height: '100%' }} value={formatNumber(trainersCount)} loading={isLoadingTrainers} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalJobs sx={{ height: '100%' }} value={formatNumber(jobsCount)} loading={isLoadingJobs} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalSchools sx={{ height: '100%' }} value={formatNumber(schoolsCount)} loading={isLoadingSchools} />
      </Grid>
    </Grid>
  );
}
