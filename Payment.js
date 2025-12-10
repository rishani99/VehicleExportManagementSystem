import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Pagination,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Tabs,
  Tab,
  Badge,
  Switch,
  FormControlLabel,
  InputAdornment
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  MoreVert,
  FilterList,
  Search,
  Download,
  Print,
  Add,
  CheckCircle,
  Pending,
  Cancel,
  AttachMoney,
  Payment,
  Receipt,
  AccountBalance,
  CreditCard,
  AccountBalanceWallet,
  TrendingUp,
  TrendingDown,
  Person,
  CalendarToday,
  Description,
  Share,
  QrCode,
  Notifications,
  Refresh
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

// Payment Status Configuration
const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'warning', icon: <Pending /> },
  processing: { label: 'Processing', color: 'info', icon: <Payment /> },
  completed: { label: 'Completed', color: 'success', icon: <CheckCircle /> },
  failed: { label: 'Failed', color: 'error', icon: <Cancel /> },
  refunded: { label: 'Refunded', color: 'secondary', icon: <AccountBalanceWallet /> },
  cancelled: { label: 'Cancelled', color: 'error', icon: <Cancel /> }
};

// Payment Methods
const PAYMENT_METHODS = {
  bank_transfer: { label: 'Bank Transfer', icon: <AccountBalance />, color: 'primary' },
  credit_card: { label: 'Credit Card', icon: <CreditCard />, color: 'info' },
  wire_transfer: { label: 'Wire Transfer', icon: <AccountBalanceWallet />, color: 'success' },
  paypal: { label: 'PayPal', icon: <Payment />, color: 'warning' },
  cryptocurrency: { label: 'Cryptocurrency', icon: <TrendingUp />, color: 'secondary' }
};

// Currencies for display
const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  AUD: 'A$',
  CAD: 'C$'
};

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [showOnlyOverdue, setShowOnlyOverdue] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  
  const navigate = useNavigate();

  // Get sample payments for demonstration
  const getSamplePayments = () => {
    return [
      {
        _id: 'PAY-2024-001',
        orderId: 'ORD-2024-001',
        invoiceNumber: 'INV-2024-001',
        customer: {
          name: 'John Smith',
          email: 'john@example.com',
          company: 'Auto Import Inc.'
        },
        amount: 28500,
        currency: 'USD',
        convertedAmount: 28500,
        targetCurrency: 'USD',
        exchangeRate: 1.0,
        paymentMethod: 'bank_transfer',
        status: 'completed',
        paymentDate: '2024-03-01',
        dueDate: '2024-03-01',
        transactionId: 'TXN7890123456',
        referenceNumber: 'REF001234',
        bankDetails: {
          bankName: 'Chase Bank',
          accountNumber: '****1234',
          routingNumber: '021000021'
        },
        notes: 'Payment received on time',
        createdAt: '2024-03-01'
      },
      {
        _id: 'PAY-2024-002',
        orderId: 'ORD-2024-002',
        invoiceNumber: 'INV-2024-002',
        customer: {
          name: 'Maria Garcia',
          email: 'maria@example.com',
          company: 'European Auto Group'
        },
        amount: 63000,
        currency: 'EUR',
        convertedAmount: 68500,
        targetCurrency: 'USD',
        exchangeRate: 1.087,
        paymentMethod: 'wire_transfer',
        status: 'processing',
        paymentDate: '2024-03-05',
        dueDate: '2024-03-10',
        transactionId: 'TXN7890123457',
        referenceNumber: 'REF001235',
        bankDetails: {
          bankName: 'Santander Bank',
          accountNumber: '****5678',
          iban: 'ES9121000418450200051332'
        },
        notes: 'Wire transfer initiated',
        createdAt: '2024-03-05'
      },
      {
        _id: 'PAY-2024-003',
        orderId: 'ORD-2024-003',
        invoiceNumber: 'INV-2024-003',
        customer: {
          name: 'David Chen',
          email: 'david@example.com',
          company: 'Asia Motors Ltd.'
        },
        amount: 230000,
        currency: 'CNY',
        convertedAmount: 32500,
        targetCurrency: 'USD',
        exchangeRate: 0.141,
        paymentMethod: 'credit_card',
        status: 'pending',
        paymentDate: null,
        dueDate: '2024-03-15',
        transactionId: null,
        referenceNumber: 'PEND001',
        notes: 'Awaiting credit card payment',
        createdAt: '2024-03-06'
      },
      {
        _id: 'PAY-2024-004',
        orderId: 'ORD-2024-004',
        invoiceNumber: 'INV-2024-004',
        customer: {
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          company: 'UK Auto Importers'
        },
        amount: 33500,
        currency: 'GBP',
        convertedAmount: 42500,
        targetCurrency: 'USD',
        exchangeRate: 1.269,
        paymentMethod: 'paypal',
        status: 'completed',
        paymentDate: '2024-03-04',
        dueDate: '2024-03-12',
        transactionId: 'TXN7890123458',
        referenceNumber: 'PP00123456',
        paypalId: 'PAYID-MD3L2XI123456',
        notes: 'PayPal payment successful',
        createdAt: '2024-03-04'
      },
      {
        _id: 'PAY-2024-005',
        orderId: 'ORD-2024-005',
        invoiceNumber: 'INV-2024-005',
        customer: {
          name: 'Michael Brown',
          email: 'michael@example.com',
          company: 'Australian Auto Trade'
        },
        amount: 115000,
        currency: 'AUD',
        convertedAmount: 75500,
        targetCurrency: 'USD',
        exchangeRate: 0.656,
        paymentMethod: 'bank_transfer',
        status: 'failed',
        paymentDate: '2024-03-03',
        dueDate: '2024-03-08',
        transactionId: 'TXN7890123459',
        referenceNumber: 'REF001236',
        failureReason: 'Insufficient funds',
        notes: 'Payment failed - bank rejected',
        createdAt: '2024-03-03'
      },
      {
        _id: 'PAY-2024-006',
        orderId: 'ORD-2024-006',
        invoiceNumber: 'INV-2024-006',
        customer: {
          name: 'Emma Wilson',
          email: 'emma@example.com',
          company: 'Canadian Vehicle Import'
        },
        amount: 61000,
        currency: 'CAD',
        convertedAmount: 45500,
        targetCurrency: 'USD',
        exchangeRate: 0.746,
        paymentMethod: 'cryptocurrency',
        status: 'completed',
        paymentDate: '2024-03-07',
        dueDate: '2024-03-20',
        transactionId: '0x1234abcd5678efgh',
        referenceNumber: 'BTC001234',
        cryptoWallet: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        notes: 'Bitcoin payment confirmed',
        createdAt: '2024-03-07'
      },
      {
        _id: 'PAY-2024-007',
        orderId: 'ORD-2024-007',
        invoiceNumber: 'INV-2024-007',
        customer: {
          name: 'Kenji Tanaka',
          email: 'kenji@example.com',
          company: 'Japan Auto Export'
        },
        amount: 4850000,
        currency: 'JPY',
        convertedAmount: 32500,
        targetCurrency: 'USD',
        exchangeRate: 0.0067,
        paymentMethod: 'bank_transfer',
        status: 'refunded',
        paymentDate: '2024-02-28',
        dueDate: '2024-03-05',
        transactionId: 'TXN7890123460',
        referenceNumber: 'REF001237',
        refundReason: 'Order cancellation',
        notes: 'Full refund processed',
        createdAt: '2024-02-28'
      },
      {
        _id: 'PAY-2024-008',
        orderId: 'ORD-2024-008',
        invoiceNumber: 'INV-2024-008',
        customer: {
          name: 'Sophie Martin',
          email: 'sophie@example.com',
          company: 'French Auto Distributors'
        },
        amount: 36500,
        currency: 'EUR',
        convertedAmount: 39500,
        targetCurrency: 'USD',
        exchangeRate: 1.082,
        paymentMethod: 'credit_card',
        status: 'cancelled',
        paymentDate: null,
        dueDate: '2024-03-18',
        transactionId: null,
        referenceNumber: 'CANC001',
        notes: 'Payment cancelled by customer',
        createdAt: '2024-03-08'
      }
    ];
  };

  // Initialize payments on component mount
  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = () => {
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      try {
        const samplePayments = getSamplePayments();
        setPayments(samplePayments);
        setError(null);
      } catch (err) {
        console.error('Error loading payments:', err);
        setError('Failed to load payments. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  // Filter payments based on search and filters
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    const matchesCurrency = currencyFilter === 'all' || payment.currency === currencyFilter;
    
    // Overdue filter
    const isOverdue = showOnlyOverdue ? isPaymentOverdue(payment) : true;
    
    return matchesSearch && matchesStatus && matchesMethod && matchesCurrency && isOverdue;
  });

  // Check if payment is overdue
  const isPaymentOverdue = (payment) => {
    if (payment.status === 'completed' || payment.status === 'refunded' || payment.status === 'cancelled') {
      return false;
    }
    
    const dueDate = new Date(payment.dueDate);
    const today = new Date();
    return dueDate < today;
  };

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + rowsPerPage);

  // Format currency
  const formatCurrency = (amount, currency) => {
    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate total amounts
  const calculateTotals = () => {
    const completedPayments = payments.filter(p => p.status === 'completed');
    const pendingPayments = payments.filter(p => p.status === 'pending');
    const overduePayments = payments.filter(p => isPaymentOverdue(p));
    
    return {
      totalReceived: completedPayments.reduce((sum, p) => sum + p.convertedAmount, 0),
      totalPending: pendingPayments.reduce((sum, p) => sum + p.convertedAmount, 0),
      totalOverdue: overduePayments.reduce((sum, p) => sum + p.convertedAmount, 0),
      completedCount: completedPayments.length,
      pendingCount: pendingPayments.length,
      overdueCount: overduePayments.length
    };
  };

  const totals = calculateTotals();

  // Handle view details
  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setDetailsDialogOpen(true);
  };

  // Handle edit payment
  const handleEditPayment = (paymentId) => {
    navigate(`/payments/edit/${paymentId}`);
  };

  // Handle delete payment
  const handleDeleteClick = (payment) => {
    setPaymentToDelete(payment);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const handleDeleteConfirm = () => {
    // Remove payment from state
    setPayments(payments.filter(payment => payment._id !== paymentToDelete._id));
    setDeleteDialogOpen(false);
    setPaymentToDelete(null);
    
    // Show success message
    alert(`Payment ${paymentToDelete._id} deleted successfully!`);
  };

  // Handle menu open
  const handleMenuOpen = (event, paymentId) => {
    setMenuAnchor(event.currentTarget);
    setSelectedPaymentId(paymentId);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedPaymentId(null);
  };

  // Get status chip
  const getStatusChip = (status) => {
    const config = STATUS_CONFIG[status] || { label: status, color: 'default' };
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  // Get payment method chip
  const getMethodChip = (method) => {
    const config = PAYMENT_METHODS[method] || { label: method, color: 'default' };
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  // Handle export data
  const handleExport = () => {
    const dataStr = JSON.stringify(payments, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'payments-export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle create new payment
  const handleCreatePayment = () => {
    navigate('/payments/new');
  };

  // Handle refresh
  const handleRefresh = () => {
    loadPayments();
  };

  // Handle view receipt
  const handleViewReceipt = (payment) => {
    setSelectedPayment(payment);
    setReceiptDialogOpen(true);
  };

  // Handle mark as paid
  const handleMarkAsPaid = (paymentId) => {
    setPayments(payments.map(payment => 
      payment._id === paymentId 
        ? { ...payment, status: 'completed', paymentDate: new Date().toISOString().split('T')[0] }
        : payment
    ));
    alert(`Payment ${paymentId} marked as paid!`);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              <AttachMoney sx={{ mr: 1, verticalAlign: 'middle' }} />
              Payments Management
            </Typography>
            <Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreatePayment}
                sx={{ mr: 1 }}
              >
                New Payment
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                sx={{ mr: 1 }}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleExport}
                sx={{ mr: 1 }}
              >
                Export
              </Button>
              <Button
                variant="outlined"
                startIcon={<Print />}
                onClick={handlePrint}
              >
                Print
              </Button>
            </Box>
          </Box>
          
          <Typography variant="body1" color="text.secondary">
            Manage and track all payment transactions for vehicle exports
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h3" fontWeight="bold" color="primary">
                      {formatCurrency(totals.totalReceived, 'USD')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Received
                    </Typography>
                  </Box>
                  <AttachMoney sx={{ fontSize: 40, color: 'primary.main', opacity: 0.8 }} />
                </Box>
                <Typography variant="caption" color="success.main" sx={{ mt: 1 }}>
                  {totals.completedCount} completed payments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h3" fontWeight="bold" color="warning.main">
                      {formatCurrency(totals.totalPending, 'USD')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Payments
                    </Typography>
                  </Box>
                  <Pending sx={{ fontSize: 40, color: 'warning.main', opacity: 0.8 }} />
                </Box>
                <Typography variant="caption" color="warning.main" sx={{ mt: 1 }}>
                  {totals.pendingCount} awaiting payment
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h3" fontWeight="bold" color="error.main">
                      {formatCurrency(totals.totalOverdue, 'USD')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Overdue Payments
                    </Typography>
                  </Box>
                  <TrendingDown sx={{ fontSize: 40, color: 'error.main', opacity: 0.8 }} />
                </Box>
                <Typography variant="caption" color="error.main" sx={{ mt: 1 }}>
                  {totals.overdueCount} overdue payments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h3" fontWeight="bold" color="info.main">
                      {payments.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Transactions
                    </Typography>
                  </Box>
                  <Receipt sx={{ fontSize: 40, color: 'info.main', opacity: 0.8 }} />
                </Box>
                <Typography variant="caption" color="info.main" sx={{ mt: 1 }}>
                  All payment records
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs Section */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="All Payments" icon={<Receipt />} iconPosition="start" />
            <Tab 
              label={
                <Badge badgeContent={totals.pendingCount} color="warning">
                  <span>Pending</span>
                </Badge>
              } 
              icon={<Pending />} 
              iconPosition="start" 
            />
            <Tab 
              label={
                <Badge badgeContent={totals.completedCount} color="success">
                  <span>Completed</span>
                </Badge>
              } 
              icon={<CheckCircle />} 
              iconPosition="start" 
            />
            <Tab 
              label={
                <Badge badgeContent={totals.overdueCount} color="error">
                  <span>Overdue</span>
                </Badge>
              } 
              icon={<Notifications />} 
              iconPosition="start" 
            />
          </Tabs>
        </Box>

        {/* Filters Section */}
        <Card sx={{ mb: 4, p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search Payments"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
                }}
                placeholder="Search by ID, invoice, customer..."
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status Filter"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <MenuItem key={key} value={key}>
                      <Box display="flex" alignItems="center">
                        <Chip 
                          label={config.label} 
                          size="small" 
                          color={config.color}
                          sx={{ mr: 1 }}
                        />
                        {config.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  label="Payment Method"
                >
                  <MenuItem value="all">All Methods</MenuItem>
                  {Object.entries(PAYMENT_METHODS).map(([key, config]) => (
                    <MenuItem key={key} value={key}>
                      <Box display="flex" alignItems="center">
                        <Chip 
                          label={config.label} 
                          size="small" 
                          color={config.color}
                          sx={{ mr: 1 }}
                        />
                        {config.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Currency</InputLabel>
                <Select
                  value={currencyFilter}
                  onChange={(e) => setCurrencyFilter(e.target.value)}
                  label="Currency"
                >
                  <MenuItem value="all">All Currencies</MenuItem>
                  {Object.keys(CURRENCY_SYMBOLS).map(currency => (
                    <MenuItem key={currency} value={currency}>
                      {currency} ({CURRENCY_SYMBOLS[currency]})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box display="flex" justifyContent="flex-end" gap={2} alignItems="center">
                <FormControlLabel
                  control={
                    <Switch
                      checked={showOnlyOverdue}
                      onChange={(e) => setShowOnlyOverdue(e.target.checked)}
                      color="error"
                    />
                  }
                  label="Overdue Only"
                />
                
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setMethodFilter('all');
                    setCurrencyFilter('all');
                    setShowOnlyOverdue(false);
                    setPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Loading State */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={10}>
            <CircularProgress size={60} />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Loading payments...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <>
            {/* Payments Table */}
            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
              <Table>
                <TableHead sx={{ bgcolor: 'primary.light' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Payment ID</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Customer</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Method</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Due Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPayments.map((payment) => {
                    const isOverdue = isPaymentOverdue(payment);
                    
                    return (
                      <TableRow 
                        key={payment._id}
                        hover
                        sx={{ 
                          '&:hover': { 
                            bgcolor: 'action.hover',
                            cursor: 'pointer'
                          },
                          bgcolor: isOverdue ? 'error.light' : 'inherit'
                        }}
                        onClick={() => handleViewDetails(payment)}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {payment._id}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Invoice: {payment.invoiceNumber}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 32, height: 32 }}>
                              <Person />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">{payment.customer?.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {payment.customer?.company}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold" color="primary">
                              {formatCurrency(payment.amount, payment.currency)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatCurrency(payment.convertedAmount, 'USD')} USD
                            </Typography>
                            <Typography variant="caption" color="info.main" display="block">
                              Rate: {payment.exchangeRate.toFixed(4)}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          {getMethodChip(payment.paymentMethod)}
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            {getStatusChip(payment.status)}
                            {isOverdue && (
                              <Chip
                                label="Overdue"
                                color="error"
                                size="small"
                                sx={{ mt: 0.5 }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {formatDate(payment.dueDate)}
                            </Typography>
                            {payment.paymentDate && (
                              <Typography variant="caption" color="success.main" display="block">
                                Paid: {formatDate(payment.paymentDate)}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(payment);
                                }}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            
                            {payment.status === 'completed' && (
                              <Tooltip title="View Receipt">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewReceipt(payment);
                                  }}
                                >
                                  <Receipt />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            {(payment.status === 'pending' || isOverdue) && (
                              <Tooltip title="Mark as Paid">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsPaid(payment._id);
                                  }}
                                >
                                  <CheckCircle />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            <Tooltip title="More Options">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMenuOpen(e, payment._id);
                                }}
                              >
                                <MoreVert />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(event, value) => setPage(value)}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}

            {/* No Results */}
            {filteredPayments.length === 0 && (
              <Box textAlign="center" py={10}>
                <AttachMoney sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No payments found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm ? `No results for "${searchTerm}"` : 'No payments in the system'}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  sx={{ mt: 2 }}
                  onClick={handleCreatePayment}
                >
                  Create New Payment
                </Button>
              </Box>
            )}
          </>
        )}

        {/* Payment Details Dialog */}
        <Dialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedPayment && (
            <>
              <DialogTitle>
                Payment Details - {selectedPayment._id}
              </DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={3}>
                  {/* Payment Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Payment Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Payment ID
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedPayment._id}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Order ID
                        </Typography>
                        <Typography variant="body1" color="primary">
                          {selectedPayment.orderId}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Invoice Number
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedPayment.invoiceNumber}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Status
                        </Typography>
                        <Box mt={1}>
                          {getStatusChip(selectedPayment.status)}
                          {isPaymentOverdue(selectedPayment) && (
                            <Chip
                              label="Overdue"
                              color="error"
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  {/* Customer Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Customer Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Customer Name
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedPayment.customer?.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Company
                        </Typography>
                        <Typography variant="body1">
                          {selectedPayment.customer?.company}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1">
                          {selectedPayment.customer?.email}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  {/* Financial Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Financial Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Payment Method
                        </Typography>
                        <Box mt={1}>
                          {getMethodChip(selectedPayment.paymentMethod)}
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Transaction ID
                        </Typography>
                        <Typography variant="body1" fontFamily="monospace">
                          {selectedPayment.transactionId || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Original Amount
                        </Typography>
                        <Typography variant="h5" color="primary" fontWeight="bold">
                          {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Converted Amount (USD)
                        </Typography>
                        <Typography variant="h5" color="success.main" fontWeight="bold">
                          {formatCurrency(selectedPayment.convertedAmount, 'USD')}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Exchange Rate
                        </Typography>
                        <Typography variant="body1">
                          1 {selectedPayment.currency} = {selectedPayment.exchangeRate.toFixed(4)} USD
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  {/* Dates Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Dates Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Due Date
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(selectedPayment.dueDate)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Payment Date
                        </Typography>
                        <Typography variant="body1" color={
                          selectedPayment.paymentDate ? 'success.main' : 'text.primary'
                        }>
                          {formatDate(selectedPayment.paymentDate) || 'Not Paid'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Created Date
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(selectedPayment.createdAt)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  {/* Additional Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Additional Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Reference Number
                        </Typography>
                        <Typography variant="body1" fontFamily="monospace">
                          {selectedPayment.referenceNumber}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Notes
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {selectedPayment.notes || 'No notes available'}
                        </Typography>
                      </Grid>
                      {selectedPayment.failureReason && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            Failure Reason
                          </Typography>
                          <Typography variant="body1" color="error.main">
                            {selectedPayment.failureReason}
                          </Typography>
                        </Grid>
                      )}
                      {selectedPayment.refundReason && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            Refund Reason
                          </Typography>
                          <Typography variant="body1" color="warning.main">
                            {selectedPayment.refundReason}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDetailsDialogOpen(false)}>
                  Close
                </Button>
                {(selectedPayment.status === 'pending' || isPaymentOverdue(selectedPayment)) && (
                  <Button 
                    variant="contained" 
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={() => {
                      handleMarkAsPaid(selectedPayment._id);
                      setDetailsDialogOpen(false);
                    }}
                  >
                    Mark as Paid
                  </Button>
                )}
                {selectedPayment.status === 'completed' && (
                  <Button 
                    variant="outlined" 
                    color="info"
                    startIcon={<Receipt />}
                    onClick={() => {
                      setDetailsDialogOpen(false);
                      handleViewReceipt(selectedPayment);
                    }}
                  >
                    View Receipt
                  </Button>
                )}
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    handleEditPayment(selectedPayment._id);
                  }}
                >
                  Edit Payment
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Receipt Dialog */}
        <Dialog
          open={receiptDialogOpen}
          onClose={() => setReceiptDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          {selectedPayment && (
            <>
              <DialogTitle>
                <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
                Payment Receipt - {selectedPayment._id}
              </DialogTitle>
              <DialogContent>
                <Box textAlign="center" py={3}>
                  <QrCode sx={{ fontSize: 150, color: 'primary.main', mb: 2 }} />
                  
                  <Card sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      PAYMENT RECEIPT
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Grid container spacing={2} textAlign="left">
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Receipt No:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedPayment._id}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Date:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          {formatDate(selectedPayment.paymentDate)}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Amount Paid:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5" color="success.main" fontWeight="bold">
                          {formatCurrency(selectedPayment.convertedAmount, 'USD')}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Payment Method:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          {PAYMENT_METHODS[selectedPayment.paymentMethod]?.label}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Transaction ID:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" fontFamily="monospace" fontSize="0.8rem">
                          {selectedPayment.transactionId}
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Thank you for your payment!
                    </Typography>
                  </Card>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setReceiptDialogOpen(false)}>
                  Close
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<Print />}
                  onClick={() => {
                    window.print();
                    setReceiptDialogOpen(false);
                  }}
                >
                  Print Receipt
                </Button>
                <Button 
                  variant="outlined" 
                  color="info"
                  startIcon={<Share />}
                  onClick={() => {
                    alert('Receipt shared!');
                    setReceiptDialogOpen(false);
                  }}
                >
                  Share Receipt
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete payment {paymentToDelete?._id}?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* More Options Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem 
            onClick={() => {
              const payment = payments.find(p => p._id === selectedPaymentId);
              if (payment) handleViewDetails(payment);
              handleMenuClose();
            }}
          >
            <Visibility sx={{ mr: 2 }} fontSize="small" />
            View Details
          </MenuItem>
          <MenuItem 
            onClick={() => {
              const payment = payments.find(p => p._id === selectedPaymentId);
              if (payment && payment.status === 'completed') handleViewReceipt(payment);
              handleMenuClose();
            }}
          >
            <Receipt sx={{ mr: 2 }} fontSize="small" />
            View Receipt
          </MenuItem>
          <MenuItem 
            onClick={() => {
              const payment = payments.find(p => p._id === selectedPaymentId);
              if (payment && (payment.status === 'pending' || isPaymentOverdue(payment))) {
                handleMarkAsPaid(payment._id);
              }
              handleMenuClose();
            }}
          >
            <CheckCircle sx={{ mr: 2 }} fontSize="small" />
            Mark as Paid
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={() => {
              const payment = payments.find(p => p._id === selectedPaymentId);
              if (payment) handleDeleteClick(payment);
              handleMenuClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 2 }} fontSize="small" />
            Delete Payment
          </MenuItem>
        </Menu>
      </Container>
    </>
  );
}