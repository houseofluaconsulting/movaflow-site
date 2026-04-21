import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import { UserQuickEditForm } from './orders-quick-edit-form';

// ----------------------------------------------------------------------

function formatToLocalTime(utcTimestamp) {
  if (!utcTimestamp) return '';

  // Parse "MM/DD/YYYY, HH:mm:ss" format
  const [datePart, timePart] = utcTimestamp.split(', ');
  const [month, day, year] = datePart.split('/');
  const [hour, minute, second] = timePart.split(':');

  // Treat as UTC and convert to local
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

  // Format for local browser time
  return utcDate.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function UserTableRow({ row, selected, editHref, onSelectRow, onDeleteRow }) {
  const menuActions = usePopover();
  const confirmDialog = useBoolean();
  const quickEditForm = useBoolean();

  const renderQuickEditForm = () => (
    <UserQuickEditForm
      currentUser={row}
      open={quickEditForm.value}
      onClose={quickEditForm.onFalse}
    />
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem component={RouterLink} href={editHref} onClick={() => menuActions.onClose()}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </li>

        <MenuItem
          onClick={() => {
            confirmDialog.onTrue();
            menuActions.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content="Are you sure want to delete?"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Delete
        </Button>
      }
    />
  );

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        {/* <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            slotProps={{
              input: {
                id: `${row.id}-checkbox`,
                'aria-label': `${row.id} checkbox`,
              },
            }}
          />
        </TableCell> */}

        {/* <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt={row.name} src={row.avatarUrl} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link
                component={RouterLink}
                href={editHref}
                color="inherit"
                sx={{ cursor: 'pointer' }}
              >
                {row.full_name}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.email}
              </Box>
            </Stack>
          </Box>
        </TableCell> */}

        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
          <Box sx={{ typography: 'caption' }}># {row.OrderId}</Box>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>{row.Type}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.Amount}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row.LeadType === 'VeteranWebsite'
            ? 'Veteran'
            : row.LeadType === 'LegacyWebsite'
              ? 'Legacy'
              : row.LeadType === 'FinalExpense'
                ? 'Final Expense'
                : row.LeadType === 'OctavianMortgage'
                  ? 'Octavian Mortgage'
                  : row.LeadType === 'LegacyMortgage'
                    ? 'Legacy Mortgage'
                    : row.LeadType}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Stack>
            {Number(row?.CreditFresh) > 0 && (
              <Label
                variant="soft"
                color="primary"
                sx={{ ml: 0, mt: 1, alignSelf: 'center', typography: 'text', fontWeight: 700 }}
              >
                {row.CreditFresh} Fresh
              </Label>
            )}

            {Number(row?.CreditAged) > 0 && (
              <Label
                variant="soft"
                color="secondary"
                sx={{ ml: 0, mt: 1, alignSelf: 'center', typography: 'text', fontWeight: 700 }}
              >
                {row.CreditAged} Aged
              </Label>
            )}
          </Stack>

        </TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.beneficiary}</TableCell> */}

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={fDate(formatToLocalTime(row.Created))}
            secondary={fTime(formatToLocalTime(row.Created))}
            slotProps={{
              primary: { noWrap: true, sx: { typography: 'body2' } },
              secondary: { sx: { mt: 0.5, typography: 'caption' } },
            }}
          />
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.Status === 'Sold' && 'success') ||
              (row.Status === 'No Contact' && 'warning') ||
              (row.Status === 'Unsold' && 'default') ||
              'default'
            }
          >
            {row.Status}
          </Label>
        </TableCell>

      </TableRow>

      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
