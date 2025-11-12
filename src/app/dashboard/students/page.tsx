'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
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
import { useGetStudentsQuery } from '@/store';
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
  const { data, isLoading } = useGetStudentsQuery();
  const { searchQuery } = useSearch();
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterSchool, setFilterSchool] = React.useState<string>('');
  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');

  // Prepare all students data
  const allStudents = React.useMemo(() => {
    const students = data?.students || [];
    return students;
  }, [data?.students]);

  // Extract unique schools for filter dropdown
  const schoolOptions = React.useMemo(() => {
    const schools = new Set<string>();
    allStudents.forEach((student) => {
      if (student.defaultSchool) {
        schools.add(student.defaultSchool);
      }
    });
    return Array.from(schools).sort();
  }, [allStudents]);

  // Reset page when search query or filters change
  React.useEffect(() => {
    setPage(0);
  }, [searchQuery, filterSchool, startDate, endDate]);

  // Filter students based on search query and filters
  const filteredStudents = React.useMemo(() => {
    let filtered = allStudents;

    // Apply school filter
    if (filterSchool) {
      filtered = filtered.filter((student) => student.defaultSchool === filterSchool);
    }

    // Apply date range filter (based on local timezone)
    if (startDate || endDate) {
      filtered = filtered.filter((student) => {
        if (!student.joiningTimestamp) return false;
        const timestamp = student.joiningTimestamp > 1e12 
          ? student.joiningTimestamp 
          : student.joiningTimestamp * 1000;
        // Convert timestamp to local date string (YYYY-MM-DD) to match what's displayed in table
        const studentDateStr = dayjs(timestamp).format('YYYY-MM-DD');
        
        if (startDate && endDate) {
          return studentDateStr >= startDate && studentDateStr <= endDate;
        } else if (startDate) {
          return studentDateStr >= startDate;
        } else if (endDate) {
          return studentDateStr <= endDate;
        }
        return true;
      });
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((student) => {
        const id = (student.id?.toString() || '').trim().toLowerCase();
        const firstName = (student.firstName || '').trim();
        const lastName = (student.lastName || '').trim();
        const fullName = [firstName, lastName].filter(Boolean).join(' ').toLowerCase();
        const email = (student.email || '').trim().toLowerCase();
        const mobileNumber = (student.mobileNumber || '').trim().toLowerCase();
        const location = ((student.locationDetails || student.locationCoordinate || '').trim()).toLowerCase();
        const school = (student.defaultSchool || '').trim().toLowerCase();
        
        return (
          id.includes(query) ||
          fullName.includes(query) ||
          email.includes(query) ||
          mobileNumber.includes(query) ||
          location.includes(query) ||
          school.includes(query)
        );
      });
    }

    return filtered;
  }, [allStudents, searchQuery, filterSchool, startDate, endDate]);

  // Sort students
  const students = React.useMemo(() => {
    if (!sortColumn) return filteredStudents;

    return [...filteredStudents].sort((a, b) => {
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
        case 'location':
          aValue = ((a.locationDetails || a.locationCoordinate || '')).toLowerCase();
          bValue = ((b.locationDetails || b.locationCoordinate || '')).toLowerCase();
          break;
        case 'school':
          aValue = (a.defaultSchool || '').toLowerCase();
          bValue = (b.defaultSchool || '').toLowerCase();
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
  }, [filteredStudents, sortColumn, sortDirection]);

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

  // Paginate students
  const paginatedStudents = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return students.slice(startIndex, endIndex);
  }, [students, page, rowsPerPage]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Students</Typography>

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
              <InputLabel>School</InputLabel>
              <Select
                value={filterSchool}
                label="School"
                onChange={(e) => setFilterSchool(e.target.value)}
              >
                <MenuItem value="">
                  <em>All Schools</em>
                </MenuItem>
                {schoolOptions.map((school) => (
                  <MenuItem key={school} value={school}>
                    {school}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size="small"
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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
              onChange={(e) => setEndDate(e.target.value)}
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
                <SortableHeader column="email" label="Email" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="mobileNumber" label="Mobile Number" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="age" label="Age" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="location" label="Location" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="school" label="School" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader column="joiningDate" label="Joining Date" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      No students found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedStudents.map((student) => {
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
                      <TableCell>{student.locationDetails || student.locationCoordinate || 'N/A'}</TableCell>
                      <TableCell>{student.defaultSchool || 'N/A'}</TableCell>
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
          count={students.length}
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
