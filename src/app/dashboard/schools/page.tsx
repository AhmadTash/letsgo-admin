'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
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
import { useGetSchoolsQuery } from '@/store';
import { useSearch } from '@/contexts/search-context';
import { formatDispatchingAlgo } from '@/lib/format-dispatching-algo';

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
  const { data, isLoading } = useGetSchoolsQuery();
  const { searchQuery } = useSearch();
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterDispatchingAlgo, setFilterDispatchingAlgo] = React.useState<string>('');
  const [filterPaymentStatus, setFilterPaymentStatus] = React.useState<string>('');
  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');

  // Prepare all schools data
  const allSchools = React.useMemo(() => {
    const schools = data?.schools || [];
    return schools;
  }, [data?.schools]);

  // Extract unique dispatching algorithms for filter dropdown
  const dispatchingAlgoOptions = React.useMemo(() => {
    const algos = new Set<string>();
    allSchools.forEach((school) => {
      if (school.dispatchingAlgo) {
        algos.add(school.dispatchingAlgo);
      }
    });
    return Array.from(algos).sort();
  }, [allSchools]);

  // Reset page when search query or filters change
  React.useEffect(() => {
    setPage(0);
  }, [searchQuery, filterDispatchingAlgo, filterPaymentStatus, startDate, endDate]);

  // Filter schools based on search query and filters
  const filteredSchools = React.useMemo(() => {
    let filtered = allSchools;

    // Apply dispatching algorithm filter
    if (filterDispatchingAlgo) {
      filtered = filtered.filter((school) => school.dispatchingAlgo === filterDispatchingAlgo);
    }

    // Apply payment status filter
    if (filterPaymentStatus) {
      if (filterPaymentStatus === 'confirmed') {
        filtered = filtered.filter((school) => school.paymentInfo?.isConfirmed === true);
      } else if (filterPaymentStatus === 'unconfirmed') {
        filtered = filtered.filter((school) => school.paymentInfo && !school.paymentInfo.isConfirmed);
      } else if (filterPaymentStatus === 'none') {
        filtered = filtered.filter((school) => !school.paymentInfo);
      }
    }

    // Apply date range filter (based on local timezone)
    if (startDate || endDate) {
      filtered = filtered.filter((school) => {
        if (!school.createTimestamp) return false;
        const timestamp = school.createTimestamp > 1e12 
          ? school.createTimestamp 
          : school.createTimestamp * 1000;
        // Convert timestamp to local date string (YYYY-MM-DD) to match what's displayed in table
        const schoolDateStr = dayjs(timestamp).format('YYYY-MM-DD');
        
        if (startDate && endDate) {
          return schoolDateStr >= startDate && schoolDateStr <= endDate;
        } else if (startDate) {
          return schoolDateStr >= startDate;
        } else if (endDate) {
          return schoolDateStr <= endDate;
        }
        return true;
      });
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((school) => {
        const id = (school.id?.toString() || '').trim().toLowerCase();
        const name = (school.name || '').trim().toLowerCase();
        const dispatchingAlgo = (school.dispatchingAlgo || '').trim().toLowerCase();
        
        return (
          id.includes(query) ||
          name.includes(query) ||
          dispatchingAlgo.includes(query)
        );
      });
    }

    return filtered;
  }, [allSchools, searchQuery, filterDispatchingAlgo, filterPaymentStatus, startDate, endDate]);

  // Sort schools
  const schools = React.useMemo(() => {
    if (!sortColumn) return filteredSchools;

    return [...filteredSchools].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortColumn) {
        case 'id':
          aValue = a.id ?? 0;
          bValue = b.id ?? 0;
          break;
        case 'name':
          aValue = (a.name || '').toLowerCase();
          bValue = (b.name || '').toLowerCase();
          break;
        case 'dispatchingAlgo':
          aValue = (a.dispatchingAlgo || '').toLowerCase();
          bValue = (b.dispatchingAlgo || '').toLowerCase();
          break;
        case 'paymentStatus':
          aValue = a.paymentInfo?.isConfirmed ? 1 : a.paymentInfo ? 0 : -1;
          bValue = b.paymentInfo?.isConfirmed ? 1 : b.paymentInfo ? 0 : -1;
          break;
        case 'createDate':
          aValue = a.createTimestamp ?? -1;
          bValue = b.createTimestamp ?? -1;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredSchools, sortColumn, sortDirection]);

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

  // Paginate schools
  const paginatedSchools = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return schools.slice(startIndex, endIndex);
  }, [schools, page, rowsPerPage]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Schools</Typography>

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
            <FormControl size="small" sx={{ minWidth: 235, flexShrink: 0 }}>
              <InputLabel>Dispatching Algorithm</InputLabel>
              <Select
                value={filterDispatchingAlgo}
                label="Dispatching Algorithm"
                onChange={(e) => {
                  setFilterDispatchingAlgo(e.target.value);
                }}
              >
                <MenuItem value="">
                  <em>All Algorithms</em>
                </MenuItem>
                {dispatchingAlgoOptions.map((algo) => (
                  <MenuItem key={algo} value={algo}>
                    {formatDispatchingAlgo(algo)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 185, flexShrink: 0 }}>
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={filterPaymentStatus}
                label="Payment Status"
                onChange={(e) => {
                  setFilterPaymentStatus(e.target.value);
                }}
              >
                <MenuItem value="">
                  <em>All Statuses</em>
                </MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="unconfirmed">Unconfirmed</MenuItem>
                <MenuItem value="none">No Payment Info</MenuItem>
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
          <Table sx={{ minWidth: '800px' }}>
            <TableHead>
              <TableRow>
                <SortableHeader column="id" label="ID" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="name" label="Name" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="dispatchingAlgo" label="Dispatching Algorithm" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="paymentStatus" label="Payment Status" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="createDate" label="Created Date" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSchools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      No schools found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSchools.map((school) => {
                  const createDate = school.createTimestamp !== null && school.createTimestamp !== undefined
                    ? (school.createTimestamp > 1e12
                    ? dayjs(school.createTimestamp).format('MMM D, YYYY')
                        : dayjs.unix(school.createTimestamp).format('MMM D, YYYY'))
                    : 'N/A';
                  const paymentStatus = school.paymentInfo?.isConfirmed 
                    ? 'Confirmed' 
                    : school.paymentInfo ? 'Unconfirmed' : 'N/A';
                  const paymentStatusColor = school.paymentInfo?.isConfirmed ? 'success' : school.paymentInfo ? 'warning' : 'default';

                  return (
                    <TableRow
                      hover
                      key={school.id || Math.random()}
                      onClick={() => {
                        if (school.id) {
                          router.push(`${paths.dashboard.schools}/${school.id.toString()}`);
                        }
                      }}
                      sx={{ cursor: school.id ? 'pointer' : 'default' }}
                    >
                      <TableCell>
                        <Typography variant="subtitle2">#{school.id || 'N/A'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{school.name || 'N/A'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={formatDispatchingAlgo(school.dispatchingAlgo)} 
                          size="small" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={paymentStatus} 
                          color={paymentStatusColor} 
                          size="medium" 
                          sx={{ width: '105px' }}
                        />
                      </TableCell>
                      <TableCell>{createDate}</TableCell>
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
          count={schools.length}
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

