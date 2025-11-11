'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useParams } from 'next/navigation';
import Alert from '@mui/material/Alert';
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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
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
import { useGetJobsQuery } from '@/store';
import type { Job } from '@/types/job';
import { formatStatus, getStatusColor, getStatusDotColor } from '@/lib/format-status';

export default function Page(): React.JSX.Element {
  const params = useParams();
  const id = params?.id ? parseInt(params.id as string, 10) : null;
  const { data, isLoading, error } = useGetJobsQuery();

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
        Failed to load job details.
      </Alert>
    );
  }

  const jobs = data?.jobs || [];
  const job = jobs.find((j: Job) => j.id === id);

  return (
    <Stack spacing={3}>
      <Button
        component={RouterLink}
        href={paths.dashboard.jobs}
        startIcon={<ArrowLeftIcon />}
        variant="text"
        sx={{ alignSelf: 'flex-start' }}
      >
        Back to Jobs
      </Button>

      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <Typography variant="h4">Job Details</Typography>
        {job ? (
        <Chip
          label={formatStatus(job.currentStatus)}
          color={getStatusColor(job.currentStatus)}
          size="medium"
        />
        ) : null}
      </Stack>

      {!job ? (
        <Alert severity="warning">
          Job not found.
        </Alert>
      ) : null}

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid xs={12}>
          <Card>
            <CardHeader title="Basic Information" />
            <Divider />
            <CardContent>
              {!job ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No data available
                </Typography>
              ) : (
                <>
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                        Job ID
                      </Typography>
                      <Typography variant="body1">#{job.id || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                        Type
                      </Typography>
                      <Typography variant="body1">{job.type || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                        Duration
                      </Typography>
                      <Typography variant="body1">{job.durationInHours ? `${job.durationInHours} hours` : 'N/A'}</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid xs={12} md={6}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                        Trainer ID
                      </Typography>
                      {job.trainerId ? (
                        <Link
                          component={RouterLink}
                          href={`${paths.dashboard.trainers}/${job.trainerId.toString()}`}
                          variant="body1"
                          sx={{ cursor: 'pointer' }}
                        >
                          {job.trainerId}
                        </Link>
                      ) : (
                        <Typography variant="body1">N/A</Typography>
                      )}
                    </Box>
                    <Box>
                      <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                        Customer ID
                      </Typography>
                      {job.customerId ? (
                        <Link
                          component={RouterLink}
                          href={`${paths.dashboard.students}/${job.customerId.toString()}`}
                          variant="body1"
                          sx={{ cursor: 'pointer' }}
                        >
                          {job.customerId}
                        </Link>
                      ) : (
                        <Typography variant="body1">N/A</Typography>
                      )}
                    </Box>
                    <Box>
                      <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                        Current Status
                      </Typography>
                      <Chip
                        label={formatStatus(job.currentStatus)}
                        color={getStatusColor(job.currentStatus)}
                        size="small"
                      />
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
              <Divider sx={{ my: 3 }} />
              <Stack spacing={2}>
                <Box>
                  <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                    Customer Note
                  </Typography>
                  <Typography variant="body1">{job.customerNote || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                    Trainer Note
                  </Typography>
                  <Typography variant="body1">{job.trainerNote || 'N/A'}</Typography>
                </Box>
              </Stack>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Pricing Information */}
          <Grid xs={12} md={6}>
            <Card>
              <CardHeader title="Pricing Information" />
              <Divider />
              <CardContent>
                <Stack spacing={3}>
                  {/* Order Summary */}
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                      Order Summary
                    </Typography>
                    <Stack spacing={1.5}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography color="text.secondary" variant="body2">
                          Base Price
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {job?.pricing?.basePrice !== null && job?.pricing?.basePrice !== undefined 
                            ? `$${job.pricing.basePrice.toFixed(2)}` 
                            : 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography color="text.secondary" variant="body2">
                          Tax {job?.pricing?.taxPercentage !== null && job?.pricing?.taxPercentage !== undefined 
                            ? `(${job.pricing.taxPercentage.toString()}%)` 
                            : ''}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {job?.pricing?.taxPrice !== null && job?.pricing?.taxPrice !== undefined 
                            ? `$${job.pricing.taxPrice.toFixed(2)}` 
                            : 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography color="text.secondary" variant="body2">
                          Payment Gateway Fee
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {job?.pricing?.paymentGatewayFee !== null && job?.pricing?.paymentGatewayFee !== undefined 
                            ? `$${job.pricing.paymentGatewayFee.toFixed(2)}` 
                            : 'N/A'}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Total Price
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                          {job?.pricing?.totalPrice !== null && job?.pricing?.totalPrice !== undefined 
                            ? `$${job.pricing.totalPrice.toFixed(2)}` 
                            : 'N/A'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  {/* Platform Commission */}
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                      Platform Commission
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid xs={12} sm={6}>
                        <Box>
                          <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                            Base Price
                          </Typography>
                          <Typography variant="body2">
                            {job?.pricing?.platformCommissionBasePrice !== null && job?.pricing?.platformCommissionBasePrice !== undefined 
                              ? `$${job.pricing.platformCommissionBasePrice.toFixed(2)}` 
                              : 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid xs={12} sm={6}>
                        <Box>
                          <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                            Percentage
                          </Typography>
                          <Typography variant="body2">
                            {job?.pricing?.platformCommissionPercentage !== null && job?.pricing?.platformCommissionPercentage !== undefined 
                              ? `${job.pricing.platformCommissionPercentage.toString()}%` 
                              : 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid xs={12} sm={6}>
                        <Box>
                          <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                            Tax Price
                          </Typography>
                          <Typography variant="body2">
                            {job?.pricing?.platformCommissionTaxPrice !== null && job?.pricing?.platformCommissionTaxPrice !== undefined 
                              ? `$${job.pricing.platformCommissionTaxPrice.toFixed(2)}` 
                              : 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Total Commission
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>
                            {job?.pricing?.platformCommissionTotalPrice !== null && job?.pricing?.platformCommissionTotalPrice !== undefined 
                              ? `$${job.pricing.platformCommissionTotalPrice.toFixed(2)}` 
                              : 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Trainer Income */}
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                      Trainer Income
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid xs={12} sm={6}>
                        <Box>
                          <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                            Base Income
                          </Typography>
                          <Typography variant="body2">
                            {job?.pricing?.trainerBaseIncome !== null && job?.pricing?.trainerBaseIncome !== undefined 
                              ? `$${job.pricing.trainerBaseIncome.toFixed(2)}` 
                              : 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid xs={12} sm={6}>
                        <Box>
                          <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                            Income Tax
                          </Typography>
                          <Typography variant="body2">
                            {job?.pricing?.trainerIncomeTax !== null && job?.pricing?.trainerIncomeTax !== undefined 
                              ? `$${job.pricing.trainerIncomeTax.toFixed(2)}` 
                              : 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Total Income
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>
                            {job?.pricing?.trainerTotalIncome !== null && job?.pricing?.trainerTotalIncome !== undefined 
                              ? `$${job.pricing.trainerTotalIncome.toFixed(2)}` 
                              : 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Referral Commission */}
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                      Referral Commission
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                          Referral Code
                        </Typography>
                        {job?.pricing?.referralCode !== null && job?.pricing?.referralCode !== undefined ? (
                          <Chip label={job.pricing.referralCode} size="small" color="primary" />
                        ) : (
                          <Typography variant="body2">N/A</Typography>
                        )}
                      </Box>
                      <Grid container spacing={2}>
                        <Grid xs={12} sm={6}>
                          <Box>
                            <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                              Base Price
                            </Typography>
                            <Typography variant="body2">
                              {job?.pricing?.referralCommssionBasePrice !== null && job?.pricing?.referralCommssionBasePrice !== undefined 
                                ? `$${job.pricing.referralCommssionBasePrice.toFixed(2)}` 
                                : 'N/A'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid xs={12} sm={6}>
                          <Box>
                            <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                              Percentage
                            </Typography>
                            <Typography variant="body2">
                              {job?.pricing?.referralCommssionPercentage !== null && job?.pricing?.referralCommssionPercentage !== undefined 
                                ? `${job.pricing.referralCommssionPercentage.toString()}%` 
                                : 'N/A'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid xs={12} sm={6}>
                          <Box>
                            <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                              Tax Price
                            </Typography>
                            <Typography variant="body2">
                              {job?.pricing?.referralCommissionTaxPrice !== null && job?.pricing?.referralCommissionTaxPrice !== undefined 
                                ? `$${job.pricing.referralCommissionTaxPrice.toFixed(2)}` 
                                : 'N/A'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid xs={12}>
                          <Divider sx={{ my: 1 }} />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              Total Commission
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                              {job?.pricing?.referralCommissionTotalPrice !== null && job?.pricing?.referralCommissionTotalPrice !== undefined 
                                ? `$${job.pricing.referralCommissionTotalPrice.toFixed(2)}` 
                                : 'N/A'}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Stack>
                  </Paper>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

        {/* Timing Information and Status History */}
          <Grid xs={12} md={6}>
            <Stack spacing={3}>
              {/* Timing Information */}
              <Card>
                <CardHeader title="Timing Information" />
                <Divider />
                <CardContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                        Created
                      </Typography>
                      <Typography variant="body1">
                        {job?.timing?.createTimestamp !== null && job?.timing?.createTimestamp !== undefined
                          ? (job.timing.createTimestamp > 1e12
                              ? dayjs(job.timing.createTimestamp).format('MMMM D, YYYY h:mm A')
                              : dayjs.unix(job.timing.createTimestamp).format('MMMM D, YYYY h:mm A'))
                          : 'N/A'}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                        Start Time
                      </Typography>
                      <Typography variant="body1">
                        {job?.timing?.startTimestamp !== null && job?.timing?.startTimestamp !== undefined
                          ? (job.timing.startTimestamp > 1e12
                              ? dayjs(job.timing.startTimestamp).format('MMMM D, YYYY h:mm A')
                              : dayjs.unix(job.timing.startTimestamp).format('MMMM D, YYYY h:mm A'))
                          : 'N/A'}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                        Completion Time
                      </Typography>
                      <Typography variant="body1">
                        {job?.timing?.completionTimestamp !== null && job?.timing?.completionTimestamp !== undefined
                          ? (job.timing.completionTimestamp > 1e12
                              ? dayjs(job.timing.completionTimestamp).format('MMMM D, YYYY h:mm A')
                              : dayjs.unix(job.timing.completionTimestamp).format('MMMM D, YYYY h:mm A'))
                          : 'N/A'}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                        Payment Confirmation Time
                      </Typography>
                      <Typography variant="body1">
                        {job?.timing?.paymentConfirmationTimestamp !== null && job?.timing?.paymentConfirmationTimestamp !== undefined
                          ? (job.timing.paymentConfirmationTimestamp > 1e12
                              ? dayjs(job.timing.paymentConfirmationTimestamp).format('MMMM D, YYYY h:mm A')
                              : dayjs.unix(job.timing.paymentConfirmationTimestamp).format('MMMM D, YYYY h:mm A'))
                          : 'N/A'}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Status History */}
              <Card>
                <CardHeader 
                  title="Status History" 
                />
                <Divider />
                <CardContent sx={{ py: 4 }}>
                {!job?.statusHistory || job.statusHistory.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    No status history available
                  </Typography>
                ) : (
                  <Box sx={{ position: 'relative', pl: 5 }}>
                    {/* Vertical line connecting dots */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: '12px',
                        top: '12px',
                        bottom: '12px',
                        width: '2px',
                        bgcolor: 'divider',
                      }}
                    />
                    <Stack spacing={4}>
                      {job.statusHistory.map((item, index) => (
                          <Box 
                            key={index} 
                            sx={{ 
                              position: 'relative', 
                              display: 'flex', 
                              alignItems: 'flex-start',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateX(4px)',
                              }
                            }}
                          >
                            {/* Colored dot with glow effect */}
                            <Box
                              sx={{
                                position: 'absolute',
                                left: '-36.3px',
                                top: '2px',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                bgcolor: getStatusDotColor(item.status),
                                border: '5px solid',
                                borderColor: 'background.paper',
                                zIndex: 1,
                                transition: 'all 0.2s ease',
                              }}
                            />
                            {/* Content */}
                            <Box sx={{ flex: 1 }}>
                              <Typography 
                                variant="body1" 
                                sx={{ fontWeight: 500 }}
                              >
                                {formatStatus(item.status)}
                                {item.initiatorType ? (
                                  <>
                                    {' · '}
                                    <Typography 
                                      component="span"
                                      variant="body1" 
                                      sx={{ 
                                        fontWeight: 400,
                                        textTransform: 'capitalize',
                                        color: 'text.secondary'
                                      }}
                                    >
                                      {item.initiatorType}
                                    </Typography>
                                  </>
                                ) : null}
                              </Typography>
                              {item.timestamp !== null && item.timestamp !== undefined ? (
                                <Typography 
                                  variant="caption" 
                                  color="text.secondary"
                                  sx={{ 
                                    mt: 0.5,
                                    display: 'block',
                                    fontWeight: 400,
                                    letterSpacing: '0.01em'
                                  }}
                                >
                                  {item.timestamp > 1e12
                                    ? dayjs(item.timestamp).format('DD MMM YYYY h:mm a')
                                    : dayjs.unix(item.timestamp).format('DD MMM YYYY h:mm a')}
                                </Typography>
                              ) : (
                                <Typography 
                                  variant="caption" 
                                  color="text.secondary"
                                  sx={{ 
                                    mt: 0.5,
                                    display: 'block',
                                    fontWeight: 400,
                                    fontStyle: 'italic'
                                  }}
                                >
                                  No Recorded Date
                                </Typography>
                              )}
                            </Box>
                          </Box>
                      ))}
                              </Stack>
                  </Box>
                )}
                </CardContent>
              </Card>
            </Stack>
          </Grid>

        {/* Offered Trainers */}
          <Grid xs={12} md={6}>
            <Card>
              <CardHeader title="Offered Trainers" />
              <Divider />
              <CardContent>
              {!job?.offeredTrainers || job.offeredTrainers.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No offered trainers available
                </Typography>
              ) : (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {job.offeredTrainers.map((trainerId, index) => (
                    <Chip
                      key={index}
                      label={`Trainer #${trainerId.toString()}`}
                      size="small"
                      variant="outlined"
                      component={RouterLink}
                      href={`${paths.dashboard.trainers}/${trainerId.toString()}`}
                      clickable
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Stack>
              )}
              </CardContent>
            </Card>
          </Grid>

        {/* Sub Jobs */}
          <Grid xs={12} md={6}>
            <Card>
              <CardHeader title="Sub Jobs" />
              <Divider />
              <CardContent>
              {!job?.subJobs || job.subJobs.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No sub jobs available
                </Typography>
              ) : (
                <List>
                  {job.subJobs.map((subJob, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Chip
                                label={formatStatus(subJob.status)}
                                color={getStatusColor(subJob.status)}
                                size="small"
                              />
                              <Typography variant="body2">
                                {subJob.durationInHours ? `${subJob.durationInHours.toString()}h` : 'N/A'}
                              </Typography>
                            </Stack>
                          }
                          secondary={
                            subJob.startTimestamp !== null && subJob.startTimestamp !== undefined && subJob.endTimestamp !== null && subJob.endTimestamp !== undefined ? (
                              <Typography variant="caption" color="text.secondary">
                                {subJob.startTimestamp > 1e12
                                  ? dayjs(subJob.startTimestamp).format('MMM D, YYYY h:mm A')
                                  : dayjs.unix(subJob.startTimestamp).format('MMM D, YYYY h:mm A')} -{' '}
                                {subJob.endTimestamp > 1e12
                                  ? dayjs(subJob.endTimestamp).format('MMM D, YYYY h:mm A')
                                  : dayjs.unix(subJob.endTimestamp).format('MMM D, YYYY h:mm A')}
                              </Typography>
                            ) : null
                          }
                        />
                      </ListItem>
                      {index < job.subJobs!.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              )}
              </CardContent>
            </Card>
          </Grid>

        {/* Payment Information */}
          <Grid xs={12}>
            <Card>
              <CardHeader title="Payment Information" />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid xs={12} md={6}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                          Payment Status
                        </Typography>
                        <Chip
                          label={formatStatus(job?.paymentInfo?.intentStatus || 'N/A')}
                          color={getStatusColor(job?.paymentInfo?.intentStatus || '')}
                          size="small"
                        />
                      </Box>
                      <Box>
                        <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                          Amount
                        </Typography>
                        <Typography variant="body1">
                          {job?.paymentInfo?.amount !== null && job?.paymentInfo?.amount !== undefined
                            ? `$${job.paymentInfo.amount.toFixed(2)}`
                            : 'N/A'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                          Payment ID
                        </Typography>
                        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                          {job?.paymentInfo?.id || 'N/A'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                          Token
                        </Typography>
                        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                          {job?.paymentInfo?.token || 'N/A'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                          Payment Created
                        </Typography>
                        <Typography variant="body2">
                          {job?.paymentInfo?.createTimestamp !== null && job?.paymentInfo?.createTimestamp !== undefined
                            ? (job.paymentInfo.createTimestamp > 1e12
                                ? dayjs(job.paymentInfo.createTimestamp).format('MMMM D, YYYY h:mm A')
                                : dayjs.unix(job.paymentInfo.createTimestamp).format('MMMM D, YYYY h:mm A'))
                            : 'N/A'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                          Refund Status
                        </Typography>
                        <Chip
                          label={formatStatus(job?.paymentInfo?.refundDetails?.refundStatus || 'N/A')}
                          color={getStatusColor(job?.paymentInfo?.refundDetails?.refundStatus || '')}
                          size="small"
                        />
                      </Box>
                      <Box>
                        <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                          Is Refund Requested
                        </Typography>
                        <Typography variant="body1">
                          {job?.paymentInfo?.refundDetails?.isRefundRequested !== null && job?.paymentInfo?.refundDetails?.isRefundRequested !== undefined
                            ? job.paymentInfo.refundDetails.isRefundRequested ? 'Yes' : 'No'
                            : 'N/A'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                          Refund Type
                        </Typography>
                        <Typography variant="body1">
                          {job?.paymentInfo?.refundDetails?.refundType || 'N/A'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                          Partial Refund Amount
                        </Typography>
                        <Typography variant="body1">
                          {job?.paymentInfo?.refundDetails?.partialRefundAmount !== null && job?.paymentInfo?.refundDetails?.partialRefundAmount !== undefined
                            ? `$${job.paymentInfo.refundDetails.partialRefundAmount.toFixed(2)}`
                            : 'N/A'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                          Is Test Payment
                        </Typography>
                        <Typography variant="body1">
                          {job?.paymentInfo?.refundDetails?.isTestPayment !== null && job?.paymentInfo?.refundDetails?.isTestPayment !== undefined
                            ? job.paymentInfo.refundDetails.isTestPayment ? 'Yes' : 'No'
                            : 'N/A'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

        {/* Payment Transfers */}
          <Grid xs={12}>
            <Card>
              <CardHeader title="Payment Transfers" />
              <Divider />
              <CardContent>
                <Box sx={{ overflowX: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Transfer ID</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Reversed Amount</TableCell>
                        <TableCell>Transaction ID</TableCell>
                        <TableCell>Destination</TableCell>
                        <TableCell>Destination Payment</TableCell>
                        <TableCell>Source Transaction</TableCell>
                        <TableCell>Transfer Group</TableCell>
                        <TableCell>Source Type</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Updated</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {job?.paymentTransfers && job.paymentTransfers.length > 0 ? (
                        job.paymentTransfers.map((transfer, index) => (
                          <TableRow key={index}>
                            <TableCell>{transfer.transferId !== null && transfer.transferId !== undefined ? transfer.transferId.toString() : 'N/A'}</TableCell>
                            <TableCell>{transfer.transferType || 'N/A'}</TableCell>
                            <TableCell>
                              <Chip
                                label={formatStatus(transfer.transferStatus || 'N/A')}
                                color={getStatusColor(transfer.transferStatus || '')}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {transfer.amount !== null && transfer.amount !== undefined
                                ? `$${transfer.amount.toFixed(2)}`
                                : 'N/A'}
                            </TableCell>
                            <TableCell>
                              {transfer.reversedAmount !== null && transfer.reversedAmount !== undefined
                                ? `$${transfer.reversedAmount.toFixed(2)}`
                                : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                {transfer.transactionId || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                {transfer.destination || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                {transfer.destinationPayment || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                {transfer.sourceTransaction || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                {transfer.transferGroup || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>{transfer.sourceType || 'N/A'}</TableCell>
                            <TableCell>
                              {transfer.createTimestamp !== null && transfer.createTimestamp !== undefined
                                ? (transfer.createTimestamp > 1e12
                                    ? dayjs(transfer.createTimestamp).format('MMM D, YYYY')
                                    : dayjs.unix(transfer.createTimestamp).format('MMM D, YYYY'))
                                : 'N/A'}
                            </TableCell>
                            <TableCell>
                              {transfer.updateTimestamp !== null && transfer.updateTimestamp !== undefined
                                ? (transfer.updateTimestamp > 1e12
                                    ? dayjs(transfer.updateTimestamp).format('MMM D, YYYY')
                                    : dayjs.unix(transfer.updateTimestamp).format('MMM D, YYYY'))
                                : 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={13} align="center">
                            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                              No payment transfers available
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </CardContent>
            </Card>
          </Grid>
      </Grid>
    </Stack>
  );
}

