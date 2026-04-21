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

import { UserQuickEditForm } from './lead-quick-edit-form';

// ----------------------------------------------------------------------

function formatToLocalTime(utcTimestamp) {
  if (!utcTimestamp) return '';

  // Parse "MM/DD/YYYY, HH:mm:ss" format
  const [datePart, timePart] = utcTimestamp.split(', ');
  const [month, day, year] = datePart.split('/');
  const [hour, minute] = timePart.split(':'); // ignore seconds

  // Treat as UTC and convert to local
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));

  // Format for local browser time (no seconds, no leading zero)
  return utcDate.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',   // ✅ removes leading zero
    minute: '2-digit',
    hour12: true,      // ✅ ensures AM/PM format
  });
}

export function UserTableRow({ row, campaigns, selected, editHref, onSelectRow, onDeleteRow, onUpdateSuccess }) {
  const menuActions = usePopover();
  const confirmDialog = useBoolean();
  const quickEditForm = useBoolean();

  const renderQuickEditForm = () => (
    <UserQuickEditForm
      currentUser={row}
      campaigns={campaigns}
      open={quickEditForm.value}
      onClose={quickEditForm.onFalse}
      created={formatToLocalTime(row.Created)}
      delivered={formatToLocalTime(row.Delivered)}
      onUpdateSuccess={onUpdateSuccess}
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
        <TableCell padding="checkbox">
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
        </TableCell>

        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt={row.name} src={row.avatarUrl} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link
                color="inherit"
                sx={{ cursor: 'pointer' }}
                onClick={quickEditForm.onTrue}
              >
                {row.full_name}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.email}
              </Box>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.phone_number}
              </Box>
            </Stack>
          </Box>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.state}</TableCell>

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

        <TableCell sx={{ whiteSpace: 'nowrap', }}>
          <Stack>
            {row?.Opportunity === 'Fresh' && (
              <Label
                variant="soft"
                color="primary"
                sx={{ alignSelf: 'center', typography: 'text', fontWeight: 700 }}
              >
                {row.Opportunity}
              </Label>
            )}

            {row?.Opportunity === 'Aged' && (
              <Label
                variant="soft"
                color="secondary"
                sx={{ alignSelf: 'center', typography: 'text', fontWeight: 700 }}
              >
                {row?.Opportunity}
              </Label>
            )}
          </Stack>

        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={fDate(formatToLocalTime(row.Delivered))}
            secondary={fTime(formatToLocalTime(row.Delivered))}
            slotProps={{
              primary: { noWrap: true, sx: { typography: 'body2' } },
              secondary: { sx: { mt: 0.5, typography: 'caption' } },
            }}
          />
        </TableCell>

        <TableCell sx={{ minWidth: 250 }}>
          {row.Note && row.Note.trim() !== '' ? (
            <Box
              sx={{
                fontSize: '0.875rem',
                lineHeight: 1.3,
                whiteSpace: 'pre-wrap',
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                padding: '8px 12px',
                borderRadius: '12px',
                display: 'inline-block',
              }}
            >
              {row.Note}
            </Box>
          ) : (
            row.Note
          )}
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

        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="More Details" placement="top" arrow>
              <IconButton
                color={quickEditForm.value ? 'inherit' : 'default'}
                onClick={quickEditForm.onTrue}
              >
                <Iconify icon="eva:more-vertical-fill" />
                {/* <Iconify icon="eva:more-vertical-fill" /> */}

              </IconButton>
            </Tooltip>

            {/* <IconButton
              color={menuActions.open ? 'inherit' : 'default'}
              onClick={menuActions.onOpen}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton> */}
          </Box>
        </TableCell>
      </TableRow>

      {renderQuickEditForm()}
      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
