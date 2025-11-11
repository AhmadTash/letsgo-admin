'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useParams } from 'next/navigation';
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
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import dayjs from 'dayjs';

import { paths } from '@/paths';
import { useGetSchoolsQuery } from '@/store';
import type { School } from '@/types/school';
import { formatDispatchingAlgo } from '@/lib/format-dispatching-algo';

export default function Page(): React.JSX.Element {
  const params = useParams();
  const id = params?.id ? parseInt(params.id as string, 10) : null;
  const { data, isLoading, error } = useGetSchoolsQuery();

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
        Failed to load school details.
      </Alert>
    );
  }

  const schools = data?.schools || [];
  const school = schools.find((s: School) => s.id === id);

  const createDate = school?.createTimestamp !== null && school?.createTimestamp !== undefined
    ? (school.createTimestamp > 1e12
        ? dayjs(school.createTimestamp).format('MMMM D, YYYY')
        : dayjs.unix(school.createTimestamp).format('MMMM D, YYYY'))
    : 'N/A';
  const paymentStatus = school?.paymentInfo?.isConfirmed
    ? 'Confirmed'
    : school?.paymentInfo
    ? 'Unconfirmed'
    : 'N/A';
  const paymentStatusColor = school?.paymentInfo?.isConfirmed ? 'success' : school?.paymentInfo ? 'warning' : 'default';

  return (
    <Stack spacing={3}>
      <Button
        component={RouterLink}
        href={paths.dashboard.schools}
        startIcon={<ArrowLeftIcon />}
        variant="text"
        sx={{ alignSelf: 'flex-start' }}
      >
        Back to Schools
      </Button>

      <Typography variant="h4">School Details</Typography>

      {!school ? (
        <Alert severity="warning">
          School not found.
        </Alert>
      ) : null}

      <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
        {/* Profile Card */}
        <Grid lg={4} md={6} xs={12}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent>
              {!school ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No data available
                </Typography>
              ) : (
                <Stack spacing={2} sx={{ alignItems: 'center' }}>
                  {school.imageUrl ? (
                    <Avatar
                      src={school.imageUrl}
                      alt={school.name || 'School Logo'}
                      sx={{
                        height: '100px',
                        width: '100px',
                        bgcolor: 'primary.main',
                      }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        height: '100px',
                        width: '100px',
                        fontSize: '2rem',
                        bgcolor: 'primary.main',
                      }}
                    >
                      {school.name?.[0]?.toUpperCase() || '?'}
                    </Avatar>
                  )}
                  <Stack spacing={1} sx={{ textAlign: 'center' }}>
                    <Typography variant="h5">{school.name || 'N/A'}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      Driving School
                    </Typography>
                  </Stack>
                </Stack>
              )}
            </CardContent>
            <Divider />
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              {!school ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No data available
                </Typography>
              ) : (
                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                  <Box>
                    <Typography color="text.secondary" variant="caption">
                      School ID
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>#{school.id || 'N/A'}</Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block' }}>
                      Dispatching Algorithm
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip 
                        label={formatDispatchingAlgo(school.dispatchingAlgo)} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography color="text.secondary" variant="caption">
                      Created Date
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>{createDate}</Typography>
                  </Box>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Pricing and Payment Information */}
        <Grid lg={8} md={6} xs={12}>
          <Stack spacing={3}>
            {/* Pricing Information Card */}
            <Card>
              <CardHeader title="Pricing Information" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid xs={6} sm={4}>
                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block' }}>
                      Express Lesson
                    </Typography>
                    <Typography variant="body1">
                      {school?.pricingInfo?.expressLessonPrice !== null && school?.pricingInfo?.expressLessonPrice !== undefined
                        ? `$${school.pricingInfo.expressLessonPrice.toFixed(2)}`
                        : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid xs={6} sm={4}>
                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block' }}>
                      Private Lesson
                    </Typography>
                    <Typography variant="body1">
                      {school?.pricingInfo?.privateLessonPrice !== null && school?.pricingInfo?.privateLessonPrice !== undefined
                        ? `$${school.pricingInfo.privateLessonPrice.toFixed(2)}`
                        : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid xs={6} sm={4}>
                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block' }}>
                      Test Lesson
                    </Typography>
                    <Typography variant="body1">
                      {school?.pricingInfo?.testLessonPrice !== null && school?.pricingInfo?.testLessonPrice !== undefined
                        ? `$${school.pricingInfo.testLessonPrice.toFixed(2)}`
                        : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid xs={6} sm={4}>
                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block' }}>
                      Test Car Rental
                    </Typography>
                    <Typography variant="body1">
                      {school?.pricingInfo?.testCarRentalLessonPrice !== null && school?.pricingInfo?.testCarRentalLessonPrice !== undefined
                        ? `$${school.pricingInfo.testCarRentalLessonPrice.toFixed(2)}`
                        : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid xs={6} sm={4}>
                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block' }}>
                      Test Mileage
                    </Typography>
                    <Typography variant="body1">
                      {school?.pricingInfo?.testMileagePrice !== null && school?.pricingInfo?.testMileagePrice !== undefined
                        ? `$${school.pricingInfo.testMileagePrice.toFixed(2)}`
                        : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid xs={6} sm={4}>
                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block' }}>
                      Referral Commission
                    </Typography>
                    <Typography variant="body1">
                      {school?.pricingInfo?.referralCommissionPercentage !== null && school?.pricingInfo?.referralCommissionPercentage !== undefined
                        ? `${school.pricingInfo.referralCommissionPercentage.toFixed(1)}%`
                        : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid xs={6} sm={4}>
                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block' }}>
                      BDE Course Price
                    </Typography>
                    <Typography variant="body1">
                      {school?.pricingInfo?.bdeCoursePrice !== null && school?.pricingInfo?.bdeCoursePrice !== undefined
                        ? `$${school.pricingInfo.bdeCoursePrice.toFixed(2)}`
                        : 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Payment Information Card */}
            <Card>
              <CardHeader title="Payment Information" />
              <Divider />
              <CardContent>
                {!school ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    No data available
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    <Box>
                      <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                        Payment Status
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Chip label={paymentStatus} color={paymentStatusColor} size="medium" sx={{ width: '105px' }}/>
                        {school.paymentInfo?.url ? (
                          <Button
                            component="a"
                            href={school.paymentInfo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            variant="outlined"
                          >
                            View Payment Link
                          </Button>
                        ) : null}
                      </Stack>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                        Payment Token
                      </Typography>
                      <Typography variant="body2">
                        {school?.paymentInfo?.token || 'N/A'}
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Additional Information Card */}
        <Grid xs={12}>
          <Card>
            <CardHeader title="Additional Information" />
            <Divider />
            <CardContent>
              <Box>
                <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                  Logo Image URL
                </Typography>
                {school?.imageUrl ? (
                  <Link 
                    href={school.imageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    variant="body2"
                    sx={{ wordBreak: 'break-all' }}
                  >
                    {school.imageUrl}
                  </Link>
                ) : (
                  <Typography variant="body2">N/A</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}

