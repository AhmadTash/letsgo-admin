'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { ArrowDown as ArrowDownIcon, ArrowUp as ArrowUpIcon, ArrowsDownUp as ArrowsDownUpIcon } from '@phosphor-icons/react/dist/ssr';
import dayjs from 'dayjs';

import { paths } from '@/paths';
import { useGetJobsQuery } from '@/store';
import type { Job } from '@/types/job';
import { useSearch } from '@/contexts/search-context';
import { formatStatus, getStatusColor } from '@/lib/format-status';

interface SortableHeaderProps {
  column: string;
  label: string;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
}

function SortableHeader({ column, label, sortColumn, sortDirection, onSort }: SortableHeaderProps): React.JSX.Element {
  const isSorted = sortColumn === column;
  return (
    <TableCell
      onClick={() => {
        onSort(column);
      }}
      sx={{
        cursor: 'pointer',
        userSelect: 'none',
        '&:hover': { backgroundColor: 'action.hover' },
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="subtitle2">{label}</Typography>
        {isSorted ? (
          sortDirection === 'asc' ? (
            <ArrowUpIcon size={16} />
          ) : (
            <ArrowDownIcon size={16} />
          )
        ) : (
          <ArrowsDownUpIcon size={16} style={{ opacity: 0.3 }} />
        )}
      </Stack>
    </TableCell>
  );
}

export default function Page(): React.JSX.Element {
  const router = useRouter();
  const { data, isLoading } = useGetJobsQuery();
  const { searchQuery } = useSearch();
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterType, setFilterType] = React.useState<string>('');
  const [filterStatus, setFilterStatus] = React.useState<string>('');
  const [filterTrainerId, setFilterTrainerId] = React.useState<string>('');
  const [filterCustomerId, setFilterCustomerId] = React.useState<string>('');
  const [filterDuration, setFilterDuration] = React.useState<string>('');
  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');

  const allJobs = React.useMemo(() => {
    return data?.jobs || [];
  }, [data?.jobs]);

  // Extract unique values for filter dropdowns
  const typeOptions = React.useMemo(() => {
    const types = new Set<string>();
    allJobs.forEach((job: Job) => {
      if (job.type) {
        types.add(job.type);
      }
    });
    return Array.from(types).sort();
  }, [allJobs]);

  const statusOptions = React.useMemo(() => {
    const statuses = new Set<string>();
    allJobs.forEach((job: Job) => {
      if (job.currentStatus) {
        statuses.add(job.currentStatus);
      }
    });
    return Array.from(statuses).sort();
  }, [allJobs]);

  const trainerIdOptions = React.useMemo(() => {
    const trainerIds = new Set<string>();
    allJobs.forEach((job: Job) => {
      if (job.trainerId) {
        trainerIds.add(job.trainerId.toString());
      }
    });
    return Array.from(trainerIds).sort((a, b) => parseInt(a) - parseInt(b));
  }, [allJobs]);

  const customerIdOptions = React.useMemo(() => {
    const customerIds = new Set<string>();
    allJobs.forEach((job: Job) => {
      if (job.customerId) {
        customerIds.add(job.customerId.toString());
      }
    });
    return Array.from(customerIds).sort((a, b) => parseInt(a) - parseInt(b));
  }, [allJobs]);

  // Reset page when search query or filters change
  React.useEffect(() => {
    setPage(0);
  }, [searchQuery, filterType, filterStatus, filterTrainerId, filterCustomerId, filterDuration, startDate, endDate]);

  // Filter jobs based on search query and filters
  const filteredJobs = React.useMemo(() => {
    let filtered = allJobs;

    // Apply type filter
    if (filterType) {
      filtered = filtered.filter((job: Job) => job.type === filterType);
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter((job: Job) => job.currentStatus === filterStatus);
    }

    // Apply trainer ID filter
    if (filterTrainerId) {
      filtered = filtered.filter((job: Job) => job.trainerId?.toString() === filterTrainerId);
    }

    // Apply customer ID filter
    if (filterCustomerId) {
      filtered = filtered.filter((job: Job) => job.customerId?.toString() === filterCustomerId);
    }

    // Apply duration filter
    if (filterDuration) {
      filtered = filtered.filter((job: Job) => {
        const duration = parseFloat(job.durationInHours || '0');
        switch (filterDuration) {
          case '0-1':
            return duration >= 0 && duration < 1;
          case '1-2':
            return duration >= 1 && duration < 2;
          case '2-5':
            return duration >= 2 && duration < 5;
          case '5-10':
            return duration >= 5 && duration < 10;
          case '10+':
            return duration >= 10;
          default:
            return true;
        }
      });
    }

    // Apply date range filter (based on local timezone)
    if (startDate || endDate) {
      filtered = filtered.filter((job: Job) => {
        if (!job.timing?.createTimestamp) return false;
        const timestamp = job.timing.createTimestamp > 1e12 
          ? job.timing.createTimestamp 
          : job.timing.createTimestamp * 1000;
        // Convert timestamp to local date string (YYYY-MM-DD) to match what's displayed in table
        const jobDateStr = dayjs(timestamp).format('YYYY-MM-DD');
        
        if (startDate && endDate) {
          return jobDateStr >= startDate && jobDateStr <= endDate;
        } else if (startDate) {
          return jobDateStr >= startDate;
        } else if (endDate) {
          return jobDateStr <= endDate;
        }
        return true;
      });
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((job: Job) => {
        const jobId = (job.id?.toString() || '').trim().toLowerCase();
        const type = (job.type || '').trim().toLowerCase();
        const status = (job.currentStatus || '').trim().toLowerCase();
        const trainerId = (job.trainerId?.toString() || '').trim().toLowerCase();
        const customerId = (job.customerId?.toString() || '').trim().toLowerCase();
        const totalPrice = (job.pricing?.totalPrice?.toString() || '').trim().toLowerCase();
        
        return (
          jobId.includes(query) ||
          type.includes(query) ||
          status.includes(query) ||
          trainerId.includes(query) ||
          customerId.includes(query) ||
          totalPrice.includes(query)
        );
      });
    }

    return filtered;
  }, [allJobs, searchQuery, filterType, filterStatus, filterTrainerId, filterCustomerId, filterDuration, startDate, endDate]);

  // Sort jobs
  const jobs = React.useMemo(() => {
    if (!sortColumn) return filteredJobs;

    return [...filteredJobs].sort((a: Job, b: Job) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortColumn) {
        case 'jobId':
          aValue = a.id ?? 0;
          bValue = b.id ?? 0;
          break;
        case 'type':
          aValue = (a.type || '').toLowerCase();
          bValue = (b.type || '').toLowerCase();
          break;
        case 'status':
          aValue = (a.currentStatus || '').toLowerCase();
          bValue = (b.currentStatus || '').toLowerCase();
          break;
        case 'trainerId':
          aValue = a.trainerId ?? 0;
          bValue = b.trainerId ?? 0;
          break;
        case 'customerId':
          aValue = a.customerId ?? 0;
          bValue = b.customerId ?? 0;
          break;
        case 'duration':
          aValue = a.durationInHours ?? 0;
          bValue = b.durationInHours ?? 0;
          break;
        case 'totalPrice':
          aValue = a.pricing?.totalPrice ?? 0;
          bValue = b.pricing?.totalPrice ?? 0;
          break;
        case 'createdDate':
          aValue = a.timing?.createTimestamp ?? -1;
          bValue = b.timing?.createTimestamp ?? -1;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredJobs, sortColumn, sortDirection]);

  const handleSort = (column: string): void => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleChangePage = (_event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Paginate jobs
  const paginatedJobs = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return jobs.slice(startIndex, endIndex);
  }, [jobs, page, rowsPerPage]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Jobs</Typography>

      <Card sx={{ p: 1.5 }}>
        <Box
          sx={{
            overflowX: 'auto',
            overflowY: 'hidden',
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': {
              height: 6,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 3,
            },
            mx: { xs: -1.5, sm: 0 },
            px: { xs: 1.5, sm: 0 },
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            p={1}
            flexWrap={{ xs: 'nowrap', sm: 'wrap' }}
            sx={{ minWidth: 'max-content' }}
          >
            <FormControl size="small" sx={{ minWidth: 150, flexShrink: 0 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={filterType}
                label="Type"
                onChange={(e) => {
                  setFilterType(e.target.value);
                }}
              >
                <MenuItem value="">
                  <em>All Types</em>
                </MenuItem>
                {typeOptions.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150, flexShrink: 0 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                }}
              >
                <MenuItem value="">
                  <em>All Statuses</em>
                </MenuItem>
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {formatStatus(status)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150, flexShrink: 0 }}>
              <InputLabel>Trainer ID</InputLabel>
              <Select
                value={filterTrainerId}
                label="Trainer ID"
                onChange={(e) => {
                  setFilterTrainerId(e.target.value);
                }}
              >
                <MenuItem value="">
                  <em>All Trainers</em>
                </MenuItem>
                {trainerIdOptions.map((trainerId) => (
                  <MenuItem key={trainerId} value={trainerId}>
                    {trainerId}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150, flexShrink: 0 }}>
              <InputLabel>Customer ID</InputLabel>
              <Select
                value={filterCustomerId}
                label="Customer ID"
                onChange={(e) => {
                  setFilterCustomerId(e.target.value);
                }}
              >
                <MenuItem value="">
                  <em>All Customers</em>
                </MenuItem>
                {customerIdOptions.map((customerId) => (
                  <MenuItem key={customerId} value={customerId}>
                    {customerId}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150, flexShrink: 0 }}>
              <InputLabel>Duration</InputLabel>
              <Select
                value={filterDuration}
                label="Duration"
                onChange={(e) => {
                  setFilterDuration(e.target.value);
                }}
              >
                <MenuItem value="">
                  <em>All Durations</em>
                </MenuItem>
                <MenuItem value="0-1">0-1 hours</MenuItem>
                <MenuItem value="1-2">1-2 hours</MenuItem>
                <MenuItem value="2-5">2-5 hours</MenuItem>
                <MenuItem value="5-10">5-10 hours</MenuItem>
                <MenuItem value="10+">10+ hours</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ minWidth: 150, flexShrink: 0 }}
            />
            <TextField
              size="small"
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ minWidth: 150, flexShrink: 0 }}
            />
          </Stack>
        </Box>
      </Card>

      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: '1000px' }}>
            <TableHead>
              <TableRow>
                <SortableHeader column="jobId" label="Job ID" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="type" label="Type" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="status" label="Status" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="trainerId" label="Trainer ID" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="customerId" label="Customer ID" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="duration" label="Duration" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="totalPrice" label="Total Price" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="createdDate" label="Created Date" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      No jobs found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedJobs.map((job: Job) => {
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
        <Divider />
        <TablePagination
          component="div"
          count={jobs.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Card>
    </Stack>
  );
}

