import { varAlpha } from 'minimal-shared/utils';
import { useEffect, useState, useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { getLeads } from 'src/actions/leads'
import { exportLeads } from 'src/actions/leads'
import { DashboardContent } from 'src/layouts/dashboard';
import { _stateNames, _leadList, LEAD_STATUS_OPTIONS, LEAD_OPPORTUNITY_OPTIONS } from 'src/_mock';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { useAuthContext } from 'src/auth/hooks';

import { UserTableRow } from '../lead-table-row';
import { UserTableToolbar } from '../lead-table-toolbar';
import { UserTableFiltersResult } from '../lead-table-filters-result';
// import { id } from 'zod/dist/types/v4/locales';

// ----------------------------------------------------------------------

const OPPORTUNITY_OPTIONS = [{ value: 'all', label: 'All' }, ...LEAD_OPPORTUNITY_OPTIONS];

const TABLE_HEAD = [
  { id: 'contact', label: 'Contact', width: 150, sortable: false },
  { id: 'state', label: 'State', width: 80 },
  { id: 'LeadType', label: 'Type', width: 80 },
  { id: 'Opportunity', label: '', width: 80 },
  { id: 'Delivered', label: 'Delivered', width: 120 },
  { id: 'Note', label: 'Note', width: 180, sortable: false },
  { id: 'Status', label: 'Status', width: 80 },
  { id: 'actions', label: '', width: 80 },
];

// ----------------------------------------------------------------------

export function UserListView() {
  const table = useTable();
  const { user } = useAuthContext();

  const confirmDialog = useBoolean();

  const user_id = user?.id
  console.log(user_id)

  // const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const promise = getLeads(user_id); // returns a Promise that resolves to an array
      const result = await promise; // result is the array
      setTableData(result[0]);
    }

    fetchData();
  }, []);

  tableData.map((item, index) => (
    <div key={index}>{item}</div>
  ))

  console.log(tableData)



  const filters = useSetState({ full_name: '', role: [], Opportunity: 'all' });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!currentFilters.full_name || currentFilters.role.length > 0 || currentFilters.Opportunity !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (contact_id) => {
      const deleteRow = tableData.filter((row) => row.contact_id !== contact_id);

      toast.success('Delete success!');
      console.log('Hello')

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleExportRows = useCallback(() => {
    // const exportRows = tableData.filter((row) => !table.selected.includes(row.contact_id));
    const exportRows = tableData.filter((row) => table.selected.includes(row.contact_id));

    // setTableData(exportRows);
    const promise = exportLeads(exportRows)
    toast.success('Export sent to Email!');

    // table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  }, [dataFiltered.length, dataInPage.length, table, tableData]);


    const handleFilterOpportunity = useCallback(
    (event, newValue) => {
      table.onResetPage();
      updateFilters({ Opportunity: newValue });
    },
    [updateFilters, table]
  );


  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Export"
      content={
        <>
          Send export of <strong> {table.selected.length} </strong> items to Email
        </>
      }
      action={
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleExportRows();
            confirmDialog.onFalse();
          }}
        >
          Export
        </Button>
      }
    />
  );

  return (
    <>
      <DashboardContent>
        <Typography variant="h3" align="center" sx={{ mb: 5 }}>
          Leads
        </Typography>
        <Card>
          <Tabs
            value={currentFilters.Opportunity}
            onChange={handleFilterOpportunity}
            sx={[
              (theme) => ({
                px: { md: 2.5 },
                boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
              }),
            ]}
          >
            {OPPORTUNITY_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === currentFilters.Opportunity) && 'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'Fresh' && 'primary') ||
                      (tab.value === 'Aged' && 'secondary') ||
                      'Unsold'
                    }
                  >
                    {['Fresh', 'Aged'].includes(tab.value)
                      ? tableData.filter((leadUser) => leadUser.Opportunity === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <UserTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ roles: _stateNames }}
          />

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.contact_id)
                )
              }
              action={
                <Tooltip title="Export">
                  <IconButton color="primary" onClick={confirmDialog.onTrue}>
                    <Iconify icon="solar:export-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.contact_id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <UserTableRow
                        key={row.contact_id}
                        row={row}
                        selected={table.selected.includes(row.contact_id)}
                        onSelectRow={() => table.onSelectRow(row.contact_id)}
                        onDeleteRow={() => handleDeleteRow(row.contact_id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            // onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { full_name, Opportunity, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (full_name) {
    inputData = inputData.filter((user) => user.full_name.toLowerCase().includes(full_name.toLowerCase()));
  }

  if (Opportunity !== 'all') {
    inputData = inputData.filter((user) => user.Opportunity === Opportunity);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.role));
  }

  return inputData;
}
