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
import { useGetTrainersQuery, useGetJobsQuery, useGetStudentsQuery } from '@/store';
import type { Trainer } from '@/types/trainer';
import type { Job } from '@/types/job';
import type { Student } from '@/types/student';
import { LocationMap } from '@/components/dashboard/location-map';
import { formatStatus, getStatusColor } from '@/lib/format-status';

export default function Page(): React.JSX.Element {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? parseInt(params.id as string, 10) : null;
  const { data, isLoading, error } = useGetTrainersQuery();
  const { data: jobsData, isLoading: isLoadingJobs } = useGetJobsQuery();
  const { data: studentsData, isLoading: isLoadingStudents } = useGetStudentsQuery();

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
        Failed to load trainer details.
      </Alert>
    );
  }

  const trainers = data?.trainers || [];
  const trainer = trainers.find((t: Trainer) => t.id === id);

  const fullName = trainer ? [trainer.firstName, trainer.lastName].filter(Boolean).join(' ') || 'N/A' : 'N/A';
  const initials = trainer ? [trainer.firstName?.[0], trainer.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?' : '?';
  const joiningDate = trainer?.joiningTimestamp !== null && trainer?.joiningTimestamp !== undefined
    ? (trainer.joiningTimestamp > 1e12
        ? dayjs(trainer.joiningTimestamp).format('MMMM D, YYYY')
        : dayjs.unix(trainer.joiningTimestamp).format('MMMM D, YYYY'))
    : 'N/A';
  const paymentStatus = trainer?.paymentInfo?.confirmed
    ? 'Confirmed'
    : trainer?.paymentInfo
    ? 'Unconfirmed'
    : 'N/A';
  const paymentStatusColor = trainer?.paymentInfo?.confirmed ? 'success' : trainer?.paymentInfo ? 'warning' : 'default';

  // Filter jobs by trainer ID
  const trainerJobs = React.useMemo(() => {
    if (!id || !jobsData?.jobs) return [];
    return jobsData.jobs.filter((job: Job) => job.trainerId === id);
  }, [id, jobsData?.jobs]);

  // Extract unique customer IDs from trainer's jobs
  const customerIds = React.useMemo(() => {
    const ids = new Set<number>();
    trainerJobs.forEach((job: Job) => {
      if (job.customerId) {
        ids.add(job.customerId);
      }
    });
    return Array.from(ids);
  }, [trainerJobs]);

  // Filter students by customer IDs from jobs
  const trainerStudents = React.useMemo(() => {
    if (!studentsData?.students || customerIds.length === 0) return [];
    return studentsData.students.filter((student: Student) => 
      student.id !== null && student.id !== undefined && customerIds.includes(student.id)
    );
  }, [studentsData?.students, customerIds]);

  return (
    <Stack spacing={3}>
      <Button
        component={RouterLink}
        href={paths.dashboard.trainers}
        startIcon={<ArrowLeftIcon />}
        variant="text"
        sx={{ alignSelf: 'flex-start' }}
      >
        Back to Trainers
      </Button>

      <Typography variant="h4">Trainer Details</Typography>

      {!trainer ? (
        <Alert severity="warning">
          Trainer not found.
        </Alert>
      ) : null}

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid lg={4} md={6} xs={12}>
          <Card>
            <CardContent>
              {!trainer ? (
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
                      Trainer
                    </Typography>
                  </Stack>
                </Stack>
              )}
            </CardContent>
            <Divider />
            <CardContent>
              {!trainer ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No data available
                </Typography>
              ) : (
                <Stack spacing={2}>
                  <Box>
                    <Typography color="text.secondary" variant="caption">
                      Trainer ID
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>#{trainer.id || 'N/A'}</Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography color="text.secondary" variant="caption">
                      Email
                    </Typography>
                    {trainer.email ? (
                      <Link href={`mailto:${trainer.email}`} variant="body2" sx={{ display: 'block', mt: 0.5, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        {trainer.email}
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
                    {trainer.mobileNumber ? (
                      <Link href={`tel:${trainer.mobileNumber}`} variant="body2" sx={{ display: 'block', mt: 0.5, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        {trainer.mobileNumber}
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
                    <Typography variant="body2">{trainer.age ?? 'N/A'}</Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography color="text.secondary" variant="caption">
                      Gender
                    </Typography>
                    <Typography variant="body2">{trainer.gender || 'N/A'}</Typography>
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
              {!trainer ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No data available
                </Typography>
              ) : (
                <Stack spacing={3}>
                  <Box>
                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                      Location Details
                    </Typography>
                    <Typography variant="body1" sx={{ mb: trainer?.locationCoordinate ? 2 : 0 }}>
                      {trainer?.locationDetails || 'N/A'}
                    </Typography>
                    {trainer?.locationCoordinate ? (
                      <Box sx={{ mt: 0 }}>
                        <LocationMap
                          coordinates={trainer.locationCoordinate}
                          locationDetails={trainer.locationDetails || undefined}
                          height={300}
                        />
                        <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                          Coordinates: {trainer.locationCoordinate}
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
                      Assigned Schools
                    </Typography>
                    {trainer.assignedSchools && trainer.assignedSchools.length > 0 ? (
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          <Chip
                            label={`${trainer.assignedSchools.length.toString()} school(s) assigned`}
                            color="primary"
                            variant="outlined"
                          />
                        </Stack>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          <Typography color="text.secondary" variant="body2" sx={{ alignSelf: 'center' }}>
                            IDs:
                          </Typography>
                          {trainer.assignedSchools.map((schoolId, index) => (
                            <React.Fragment key={schoolId}>
                              <Link
                                component={RouterLink}
                                href={`${paths.dashboard.schools}/${schoolId.toString()}`}
                                variant="body2"
                                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                              >
                                {schoolId}
                              </Link>
                              {index < trainer.assignedSchools.length - 1 && (
                                <Typography color="text.secondary" variant="body2" sx={{ alignSelf: 'center' }}>
                                  ,
                                </Typography>
                              )}
                            </React.Fragment>
                          ))}
                        </Stack>
                      </Stack>
                    ) : (
                      <Typography variant="body1">No schools assigned</Typography>
                    )}
                  </Box>

                  <Divider />

                  <Box>
                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                      Payment Status
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Chip label={paymentStatus} color={paymentStatusColor} size="medium" sx={{ width: '105px' }}/>
                      {trainer?.paymentInfo?.url ? (
                        <Button
                          component="a"
                          href={trainer.paymentInfo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          variant="outlined"
                        >
                          View Payment Link
                        </Button>
                      ) : null}
                    </Stack>
                    <Box sx={{ mt: 1 }}>
                      <Typography color="text.secondary" variant="body2">
                        Token: {trainer?.paymentInfo?.token || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 0.5 }}>
                      <Typography color="text.secondary" variant="body2">
                        Payment created: {trainer?.paymentInfo?.createTimestamp !== null && trainer?.paymentInfo?.createTimestamp !== undefined
                          ? (trainer.paymentInfo.createTimestamp > 1e12
                              ? dayjs(trainer.paymentInfo.createTimestamp).format('MMMM D, YYYY')
                              : dayjs.unix(trainer.paymentInfo.createTimestamp).format('MMMM D, YYYY'))
                          : 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 0.5 }}>
                      <Typography color="text.secondary" variant="body2">
                        Link refreshed: {trainer?.paymentInfo?.urlRefreshCount !== null && trainer?.paymentInfo?.urlRefreshCount !== undefined
                          ? `${trainer.paymentInfo.urlRefreshCount} time(s)`
                          : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                      Created Date
                    </Typography>
                    <Typography variant="body1">
                      {trainer?.createTimestamp !== null && trainer?.createTimestamp !== undefined
                        ? (trainer.createTimestamp > 1e12
                            ? dayjs(trainer.createTimestamp).format('MMMM D, YYYY')
                            : dayjs.unix(trainer.createTimestamp).format('MMMM D, YYYY'))
                        : 'N/A'}
                    </Typography>
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

      {/* Trainer's Jobs Table */}
      <Card>
        <CardHeader title="Trainer's Jobs" />
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
                  <TableCell>Customer ID</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Total Price</TableCell>
                  <TableCell>Created Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trainerJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                        No jobs found for this trainer
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  trainerJobs.map((job: Job) => {
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
                          {job.customerId ? (
                            <Link
                              component={RouterLink}
                              href={`${paths.dashboard.students}/${job.customerId.toString()}`}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                            >
                              {job.customerId}
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

      {/* Trainer's Students Table */}
      <Card>
        <CardHeader title="Trainer's Students" />
        <Divider />
        {isLoadingStudents ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: '800px' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Mobile Number</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Default School</TableCell>
                  <TableCell>Joining Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trainerStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                        No students found for this trainer
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  trainerStudents.map((student: Student) => {
                    const fullName = [student.firstName, student.lastName].filter(Boolean).join(' ') || 'N/A';
                    const joiningDate = student.joiningTimestamp !== null && student.joiningTimestamp !== undefined
                      ? (student.joiningTimestamp > 1e12
                          ? dayjs(student.joiningTimestamp).format('MMM D, YYYY')
                          : dayjs.unix(student.joiningTimestamp).format('MMM D, YYYY'))
                      : 'N/A';

                    return (
                      <TableRow
                        hover
                        key={student.id || Math.random()}
                        onClick={() => {
                          if (student.id) {
                            router.push(`${paths.dashboard.students}/${student.id.toString()}`);
                          }
                        }}
                        sx={{ cursor: student.id ? 'pointer' : 'default' }}
                      >
                        <TableCell>
                          <Typography variant="subtitle2">#{student.id || 'N/A'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">{fullName}</Typography>
                        </TableCell>
                        <TableCell>
                          {student.email ? (
                            <Link
                              href={`mailto:${student.email}`}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                            >
                              {student.email}
                            </Link>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          {student.mobileNumber ? (
                            <Link
                              href={`tel:${student.mobileNumber}`}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                            >
                              {student.mobileNumber}
                            </Link>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>{student.age ?? 'N/A'}</TableCell>
                        <TableCell>{student.locationDetails || 'N/A'}</TableCell>
                        <TableCell>{student.defaultSchool || 'N/A'}</TableCell>
                        <TableCell>{joiningDate}</TableCell>
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

