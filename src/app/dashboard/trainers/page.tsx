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
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
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
import { useGetTrainersQuery } from '@/store';
import { useSearch } from '@/contexts/search-context';

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
  const { data, isLoading } = useGetTrainersQuery();
  const { searchQuery } = useSearch();
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterGender, setFilterGender] = React.useState<string>('');
  const [filterPaymentStatus, setFilterPaymentStatus] = React.useState<string>('');

  // Prepare all trainers data
  const allTrainers = React.useMemo(() => {
    const trainers = data?.trainers || [];
    return trainers;
  }, [data?.trainers]);

  // Extract unique genders for filter dropdown
  const genderOptions = React.useMemo(() => {
    const genders = new Set<string>();
    allTrainers.forEach((trainer) => {
      if (trainer.gender) {
        genders.add(trainer.gender);
      }
    });
    return Array.from(genders).sort();
  }, [allTrainers]);

  // Reset page when search query or filters change
  React.useEffect(() => {
    setPage(0);
  }, [searchQuery, filterGender, filterPaymentStatus]);

  // Filter trainers based on search query and filters
  const filteredTrainers = React.useMemo(() => {
    let filtered = allTrainers;

    // Apply gender filter
    if (filterGender) {
      filtered = filtered.filter((trainer) => trainer.gender === filterGender);
    }

    // Apply payment status filter
    if (filterPaymentStatus) {
      if (filterPaymentStatus === 'confirmed') {
        filtered = filtered.filter((trainer) => trainer.paymentInfo?.confirmed === true);
      } else if (filterPaymentStatus === 'unconfirmed') {
        filtered = filtered.filter((trainer) => trainer.paymentInfo && !trainer.paymentInfo.confirmed);
      } else if (filterPaymentStatus === 'none') {
        filtered = filtered.filter((trainer) => !trainer.paymentInfo);
      }
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((trainer) => {
        const id = (trainer.id?.toString() || '').trim().toLowerCase();
        const firstName = (trainer.firstName || '').trim();
        const lastName = (trainer.lastName || '').trim();
        const fullName = [firstName, lastName].filter(Boolean).join(' ').toLowerCase();
        const email = (trainer.email || '').trim().toLowerCase();
        const mobileNumber = (trainer.mobileNumber || '').trim().toLowerCase();
        const location = ((trainer.locationDetails || trainer.locationCoordinate || '').trim()).toLowerCase();
        const gender = (trainer.gender || '').trim().toLowerCase();
        
        return (
          id.includes(query) ||
          fullName.includes(query) ||
          email.includes(query) ||
          mobileNumber.includes(query) ||
          location.includes(query) ||
          gender.includes(query)
        );
      });
    }

    return filtered;
  }, [allTrainers, searchQuery, filterGender, filterPaymentStatus]);

  // Sort trainers
  const trainers = React.useMemo(() => {
    if (!sortColumn) return filteredTrainers;

    return [...filteredTrainers].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortColumn) {
        case 'id':
          aValue = a.id ?? 0;
          bValue = b.id ?? 0;
          break;
        case 'name':
          aValue = [a.firstName, a.lastName].filter(Boolean).join(' ').toLowerCase() || '';
          bValue = [b.firstName, b.lastName].filter(Boolean).join(' ').toLowerCase() || '';
          break;
        case 'email':
          aValue = (a.email || '').toLowerCase();
          bValue = (b.email || '').toLowerCase();
          break;
        case 'mobileNumber':
          aValue = (a.mobileNumber || '').toLowerCase();
          bValue = (b.mobileNumber || '').toLowerCase();
          break;
        case 'age':
          aValue = a.age ?? 0;
          bValue = b.age ?? 0;
          break;
        case 'gender':
          aValue = (a.gender || '').toLowerCase();
          bValue = (b.gender || '').toLowerCase();
          break;
        case 'location':
          aValue = ((a.locationDetails || a.locationCoordinate || '')).toLowerCase();
          bValue = ((b.locationDetails || b.locationCoordinate || '')).toLowerCase();
          break;
        case 'assignedSchools':
          aValue = a.assignedSchools?.length ?? 0;
          bValue = b.assignedSchools?.length ?? 0;
          break;
        case 'paymentStatus':
          aValue = a.paymentInfo?.confirmed ? 1 : a.paymentInfo ? 0 : -1;
          bValue = b.paymentInfo?.confirmed ? 1 : b.paymentInfo ? 0 : -1;
          break;
        case 'joiningDate':
          aValue = a.joiningTimestamp ?? -1;
          bValue = b.joiningTimestamp ?? -1;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredTrainers, sortColumn, sortDirection]);

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

  // Paginate trainers
  const paginatedTrainers = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return trainers.slice(startIndex, endIndex);
  }, [trainers, page, rowsPerPage]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Trainers</Typography>

      <Card sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Gender</InputLabel>
            <Select
              value={filterGender}
              label="Gender"
              onChange={(e) => setFilterGender(e.target.value)}
            >
              <MenuItem value="">
                <em>All Genders</em>
              </MenuItem>
              {genderOptions.map((gender) => (
                <MenuItem key={gender} value={gender}>
                  {gender}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Payment Status</InputLabel>
            <Select
              value={filterPaymentStatus}
              label="Payment Status"
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
            >
              <MenuItem value="">
                <em>All Statuses</em>
              </MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="unconfirmed">Unconfirmed</MenuItem>
              <MenuItem value="none">No Payment Info</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Card>

      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: '800px' }}>
            <TableHead>
              <TableRow>
                <SortableHeader column="id" label="ID" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="name" label="Name" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="email" label="Email" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="mobileNumber" label="Mobile Number" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="age" label="Age" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="gender" label="Gender" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="location" label="Location" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="assignedSchools" label="Assigned Schools" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="paymentStatus" label="Payment Status" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="joiningDate" label="Joining Date" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTrainers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      No trainers found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTrainers.map((trainer) => {
                  const fullName = [trainer.firstName, trainer.lastName].filter(Boolean).join(' ') || 'N/A';
                  const joiningDate = trainer.joiningTimestamp !== null && trainer.joiningTimestamp !== undefined
                    ? (trainer.joiningTimestamp > 1e12
                    ? dayjs(trainer.joiningTimestamp).format('MMM D, YYYY')
                        : dayjs.unix(trainer.joiningTimestamp).format('MMM D, YYYY'))
                    : 'N/A';
                  const assignedSchools = trainer.assignedSchools?.length 
                    ? `${trainer.assignedSchools.length.toString()} school(s)`
                    : 'None';
                  const paymentStatus = trainer.paymentInfo?.confirmed 
                    ? 'Confirmed' 
                    : trainer.paymentInfo ? 'Unconfirmed' : 'N/A';
                  const paymentStatusColor = trainer.paymentInfo?.confirmed ? 'success' : trainer.paymentInfo ? 'warning' : 'default';

                  return (
                    <TableRow
                      hover
                      key={trainer.id || Math.random()}
                      onClick={() => {
                        if (trainer.id) {
                          router.push(`${paths.dashboard.trainers}/${trainer.id.toString()}`);
                        }
                      }}
                      sx={{ cursor: trainer.id ? 'pointer' : 'default' }}
                    >
                      <TableCell>
                        <Typography variant="subtitle2">#{trainer.id || 'N/A'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{fullName}</Typography>
                      </TableCell>
                      <TableCell>
                        {trainer.email ? (
                          <Link
                            href={`mailto:${trainer.email}`}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                          >
                            {trainer.email}
                          </Link>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        {trainer.mobileNumber ? (
                          <Link
                            href={`tel:${trainer.mobileNumber}`}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                          >
                            {trainer.mobileNumber}
                          </Link>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>{trainer.age ?? 'N/A'}</TableCell>
                      <TableCell>{trainer.gender || 'N/A'}</TableCell>
                      <TableCell>{trainer.locationDetails || trainer.locationCoordinate || 'N/A'}</TableCell>
                      <TableCell>{assignedSchools}</TableCell>
                      <TableCell>
                        <Chip 
                          label={paymentStatus} 
                          color={paymentStatusColor} 
                          size="medium" 
                          sx={{ width: '105px' }}
                        />
                      </TableCell>
                      <TableCell>{joiningDate}</TableCell>
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
          count={trainers.length}
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
