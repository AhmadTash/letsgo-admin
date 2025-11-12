'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import dayjs from 'dayjs';

import { paths } from '@/paths';
import { useGetStudentsQuery, useGetJobsQuery } from '@/store';
import type { Student } from '@/types/student';
import type { Job } from '@/types/job';
import { LocationMap } from '@/components/dashboard/location-map';
import { formatStatus, getStatusColor } from '@/lib/format-status';

export default function Page(): React.JSX.Element {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? parseInt(params.id as string, 10) : null;
  const { data, isLoading, error } = useGetStudentsQuery();
  const { data: jobsData, isLoading: isLoadingJobs } = useGetJobsQuery();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !id) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load student details.
      </Alert>
    );
  }

  const students = data?.students || [];
  const student = students.find((s: Student) => s.id === id);

  const fullName = student ? [student.firstName, student.lastName].filter(Boolean).join(' ') || 'N/A' : 'N/A';
  const initials = student ? [student.firstName?.[0], student.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?' : '?';
  const joiningDate = student?.joiningTimestamp !== null && student?.joiningTimestamp !== undefined
    ? (student.joiningTimestamp > 1e12
        ? dayjs(student.joiningTimestamp).format('MMMM D, YYYY')
        : dayjs.unix(student.joiningTimestamp).format('MMMM D, YYYY'))
    : 'N/A';

  // Filter jobs by customer ID (student ID)
  const studentJobs = React.useMemo(() => {
    if (!id || !jobsData?.jobs) return [];
    return jobsData.jobs.filter((job: Job) => job.customerId === id);
  }, [id, jobsData?.jobs]);

  return (
    <Stack spacing={3}>
      <Button
        component={RouterLink}
        href={paths.dashboard.students}
        startIcon={<ArrowLeftIcon />}
        variant="text"
        sx={{ alignSelf: 'flex-start' }}
      >
        Back to Students
      </Button>

      <Typography variant="h4">Student Details</Typography>

      {!student ? (
        <Alert severity="warning">
          Student not found.
        </Alert>
      ) : null}

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid lg={4} md={6} xs={12}>
          <Card>
            <CardContent>
              {!student ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No data available
                </Typography>
              ) : (
                <Stack spacing={2} sx={{ alignItems: 'center' }}>
                  <Avatar
                    sx={{
                      height: '100px',
                      width: '100px',
                      fontSize: '2rem',
                      bgcolor: 'primary.main',
                    }}
                  >
                    {initials}
                  </Avatar>
                  <Stack spacing={1} sx={{ textAlign: 'center' }}>
                    <Typography variant="h5">{fullName}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      Student
                    </Typography>
                  </Stack>
                </Stack>
              )}
            </CardContent>
            <Divider />
            <CardContent>
              {!student ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No data available
                </Typography>
              ) : (
                <Stack spacing={2}>
                  <Box>
                    <Typography color="text.secondary" variant="caption">
                      Student ID
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>#{student.id || 'N/A'}</Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography color="text.secondary" variant="caption">
                      Email
                    </Typography>
                    {student.email ? (
                      <Link href={`mailto:${student.email}`} variant="body2" sx={{ display: 'block', mt: 0.5, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        {student.email}
                      </Link>
                    ) : (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>N/A</Typography>
                    )}
                  </Box>
                  <Divider />
                  <Box>
                    <Typography color="text.secondary" variant="caption">
                      Mobile Number
                    </Typography>
                    {student.mobileNumber ? (
                      <Link href={`tel:${student.mobileNumber}`} variant="body2" sx={{ display: 'block', mt: 0.5, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        {student.mobileNumber}
                      </Link>
                    ) : (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>N/A</Typography>
                    )}
                  </Box>
                  <Divider />
                  <Box>
                    <Typography color="text.secondary" variant="caption">
                      Age
                    </Typography>
                    <Typography variant="body2">{student.age ?? 'N/A'}</Typography>
                  </Box>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Details Card */}
        <Grid lg={8} md={6} xs={12}>
          <Card>
            <CardHeader title="Additional Information" />
            <Divider />
            <CardContent>
              {!student ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No data available
                </Typography>
              ) : (
                <Stack spacing={3}>
                  <Box>
                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                      Location Details
                    </Typography>
                    <Typography variant="body1" sx={{ mb: student?.locationCoordinate ? 2 : 0 }}>
                      {student?.locationDetails || 'N/A'}
                    </Typography>
                    {student?.locationCoordinate ? (
                      <Box sx={{ mt: 0 }}>
                        <LocationMap
                          coordinates={student.locationCoordinate}
                          locationDetails={student.locationDetails || undefined}
                          height={300}
                        />
                        <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                          Coordinates: {student.locationCoordinate}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        No location coordinates available
                      </Typography>
                    )}
                  </Box>

                  <Divider />

                  <Box>
                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                      Default School
                    </Typography>
                    <Typography variant="body1">{student.defaultSchool || 'N/A'}</Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                      Joining Date
                    </Typography>
                    <Typography variant="body1">{joiningDate}</Typography>
                  </Box>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Student's Jobs Table */}
      <Card>
        <CardHeader title="Student's Jobs" />
        <Divider />
        {isLoadingJobs ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: '800px' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Job ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Trainer ID</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Total Price</TableCell>
                  <TableCell>Created Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                        No jobs found for this student
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  studentJobs.map((job: Job) => {
                    const createdDate = job.timing?.createTimestamp !== null && job.timing?.createTimestamp !== undefined
                      ? (job.timing.createTimestamp > 1e12
                          ? dayjs(job.timing.createTimestamp).format('MMM D, YYYY')
                          : dayjs.unix(job.timing.createTimestamp).format('MMM D, YYYY'))
                      : 'N/A';
                    const totalPrice = job.pricing?.totalPrice ? `$${job.pricing.totalPrice.toFixed(2)}` : 'N/A';

                    return (
                      <TableRow
                        hover
                        key={job.id || Math.random()}
                        onClick={() => {
                          if (job.id) {
                            router.push(`${paths.dashboard.jobs}/${job.id.toString()}`);
                          }
                        }}
                        sx={{ cursor: job.id ? 'pointer' : 'default' }}
                      >
                        <TableCell>
                          <Typography variant="subtitle2">#{job.id || 'N/A'}</Typography>
                        </TableCell>
                        <TableCell>{job.type || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip
                            label={formatStatus(job.currentStatus)}
                            color={getStatusColor(job.currentStatus)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {job.trainerId ? (
                            <Link
                              component={RouterLink}
                              href={`${paths.dashboard.trainers}/${job.trainerId.toString()}`}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                            >
                              {job.trainerId}
                            </Link>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>{job.durationInHours ? `${job.durationInHours}h` : 'N/A'}</TableCell>
                        <TableCell>{totalPrice}</TableCell>
                        <TableCell>{createdDate}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Box>
        )}
      </Card>
    </Stack>
  );
}

