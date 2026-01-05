// ----------------------------------------------------------------------

export function rowInPage(data, page, rowsPerPage) {
  return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

// ----------------------------------------------------------------------

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

// ----------------------------------------------------------------------

/**
 * @example
 * const data = {
 *   calories: 360,
 *   align: 'center',
 *   more: {
 *     protein: 42,
 *   },
 * };
 *
 * const ex1 = getNestedProperty(data, 'calories');
 * console.log('ex1', ex1); // output: 360
 *
 * const ex2 = getNestedProperty(data, 'align');
 * console.log('ex2', ex2); // output: center
 *
 * const ex3 = getNestedProperty(data, 'more.protein');
 * console.log('ex3', ex3); // output: 42
 */
function getNestedProperty(obj, key) {
  return key.split('.').reduce((acc, part) => acc && acc[part], obj);
}

function parseDateString(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;

  // Parse "MM/DD/YYYY, HH:mm:ss" format
  const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return null;

  const [, month, day, year, hour, minute, second = '0'] = match;
  return new Date(year, month - 1, day, hour, minute, second);
}

function descendingComparator(a, b, orderBy) {
  let aValue = getNestedProperty(a, orderBy);
  let bValue = getNestedProperty(b, orderBy);

  // Try to parse as dates for date-like fields (Created, Delivered, etc.)
  if (orderBy === 'Created' || orderBy === 'Delivered') {
    const aDate = parseDateString(aValue);
    const bDate = parseDateString(bValue);

    if (aDate && bDate) {
      aValue = aDate.getTime();
      bValue = bDate.getTime();
    }
  }

  if (bValue < aValue) {
    return -1;
  }

  if (bValue > aValue) {
    return 1;
  }

  return 0;
}

// ----------------------------------------------------------------------

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
