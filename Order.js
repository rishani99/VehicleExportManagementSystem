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
  Select
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
  LocalShipping,
  Cancel,
  Assignment,
  AttachMoney,
  Person
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

// Order Status Configuration
const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'warning', icon: <Pending /> },
  confirmed: { label: 'Confirmed', color: 'info', icon: <CheckCircle /> },
  processing: { label: 'Processing', color: 'primary', icon: <Assignment /> },
  shipped: { label: 'Shipped', color: 'success', icon: <LocalShipping /> },
  delivered: { label: 'Delivered', color: 'secondary', icon: <CheckCircle /> },
  cancelled: { label: 'Cancelled', color: 'error', icon: <Cancel /> }
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

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  
  const navigate = useNavigate();

  // Get sample orders for demonstration
  const getSampleOrders = () => {
    return [
      {
        _id: 'ORD-2024-001',
        buyer: {
          name: 'John Smith',
          email: 'john@example.com',
          country: 'United States'
        },
        vehicle: {
          make: 'Toyota',
          model: 'Camry',
          vin: '1HGCM82633A123456',
          year: 2023
        },
        priceUSD: 28500,
        convertedPrice: 28500,
        buyerCurrency: 'USD',
        status: 'confirmed',
        orderDate: '2024-03-01',
        estimatedDelivery: '2024-04-15',
        shippingMethod: 'Sea Freight'
      },
      {
        _id: 'ORD-2024-002',
        buyer: {
          name: 'Maria Garcia',
          email: 'maria@example.com',
          country: 'Spain'
        },
        vehicle: {
          make: 'BMW',
          model: 'X5',
          vin: '5XYZU3LBXGG123789',
          year: 2024
        },
        priceUSD: 68500,
        convertedPrice: 63000,
        buyerCurrency: 'EUR',
        status: 'shipped',
        orderDate: '2024-02-28',
        estimatedDelivery: '2024-03-30',
        shippingMethod: 'Air Freight'
      },
      {
        _id: 'ORD-2024-003',
        buyer: {
          name: 'David Chen',
          email: 'david@example.com',
          country: 'China'
        },
        vehicle: {
          make: 'Honda',
          model: 'CR-V',
          vin: 'JHMZE2H35CC123987',
          year: 2024
        },
        priceUSD: 32500,
        convertedPrice: 230000,
        buyerCurrency: 'CNY',
        status: 'pending',
        orderDate: '2024-03-05',
        estimatedDelivery: '2024-05-01',
        shippingMethod: 'Sea Freight'
      },
      {
        _id: 'ORD-2024-004',
        buyer: {
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          country: 'United Kingdom'
        },
        vehicle: {
          make: 'Audi',
          model: 'A4',
          vin: 'WAUZZZ8K9BA123654',
          year: 2023
        },
        priceUSD: 42500,
        convertedPrice: 33500,
        buyerCurrency: 'GBP',
        status: 'processing',
        orderDate: '2024-03-02',
        estimatedDelivery: '2024-04-20',
        shippingMethod: 'Sea Freight'
      },
      {
        _id: 'ORD-2024-005',
        buyer: {
          name: 'Michael Brown',
          email: 'michael@example.com',
          country: 'Australia'
        },
        vehicle: {
          make: 'Mercedes',
          model: 'E-Class',
          vin: 'WDDZF4KBXLA123321',
          year: 2024
        },
        priceUSD: 75500,
        convertedPrice: 115000,
        buyerCurrency: 'AUD',
        status: 'delivered',
        orderDate: '2024-01-15',
        deliveryDate: '2024-02-28',
        shippingMethod: 'Air Freight'
      },
      {
        _id: 'ORD-2024-006',
        buyer: {
          name: 'Emma Wilson',
          email: 'emma@example.com',
          country: 'Canada'
        },
        vehicle: {
          make: 'Ford',
          model: 'Explorer',
          vin: '1FMCU0GDXRKA12345',
          year: 2024
        },
        priceUSD: 45500,
        convertedPrice: 61000,
        buyerCurrency: 'CAD',
        status: 'shipped',
        orderDate: '2024-02-20',
        estimatedDelivery: '2024-04-10',
        shippingMethod: 'Sea Freight'
      },
      {
        _id: 'ORD-2024-007',
        buyer: {
          name: 'Kenji Tanaka',
          email: 'kenji@example.com',
          country: 'Japan'
        },
        vehicle: {
          make: 'Toyota',
          model: 'Prius',
          vin: 'JTDKN3DU8A1234567',
          year: 2024
        },
        priceUSD: 32500,
        convertedPrice: 4850000,
        buyerCurrency: 'JPY',
        status: 'confirmed',
        orderDate: '2024-03-10',
        estimatedDelivery: '2024-05-20',
        shippingMethod: 'Sea Freight'
      },
      {
        _id: 'ORD-2024-008',
        buyer: {
          name: 'Sophie Martin',
          email: 'sophie@example.com',
          country: 'France'
        },
        vehicle: {
          make: 'Volkswagen',
          model: 'Tiguan',
          vin: 'WVGZZZ5NZJW123456',
          year: 2023
        },
        priceUSD: 39500,
        convertedPrice: 36500,
        buyerCurrency: 'EUR',
        status: 'cancelled',
        orderDate: '2024-01-25',
        shippingMethod: 'Air Freight'
      }
    ];
  };

  // Fetch orders from API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      try {
        // For now, use sample data
        const sampleOrders = getSampleOrders();
        setOrders(sampleOrders);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Using sample data instead.');
      } finally {
        setLoading(false);
      }
    }, 1000); // 1 second delay to simulate network
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vehicle?.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vehicle?.model?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + rowsPerPage);

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

  // Handle view details
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  // Handle edit order
  const handleEditOrder = (orderId) => {
    navigate(`/orders/edit/${orderId}`);
  };

  // Handle delete order
  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const handleDeleteConfirm = () => {
    // Remove order from state
    setOrders(orders.filter(order => order._id !== orderToDelete._id));
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
    
    // Show success message
    alert(`Order ${orderToDelete._id} deleted successfully!`);
  };

  // Handle menu open
  const handleMenuOpen = (event, orderId) => {
    setMenuAnchor(event.currentTarget);
    setSelectedOrderId(orderId);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedOrderId(null);
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

  // Handle export data
  const handleExport = () => {
    const dataStr = JSON.stringify(orders, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'orders-export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle create new order
  const handleCreateOrder = () => {
    navigate('/orders/new');
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
              Orders Management
            </Typography>
            <Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateOrder}
                sx={{ mr: 1 }}
              >
                New Order
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
            Manage and track all vehicle export orders
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
                      {orders.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Orders
                    </Typography>
                  </Box>
                  <Assignment sx={{ fontSize: 40, color: 'primary.main', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h3" fontWeight="bold" color="success.main">
                      {orders.filter(o => o.status === 'delivered').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Delivered
                    </Typography>
                  </Box>
                  <CheckCircle sx={{ fontSize: 40, color: 'success.main', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h3" fontWeight="bold" color="warning.main">
                      {orders.filter(o => o.status === 'pending' || o.status === 'processing' || o.status === 'confirmed').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      In Progress
                    </Typography>
                  </Box>
                  <LocalShipping sx={{ fontSize: 40, color: 'warning.main', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h3" fontWeight="bold" color="info.main">
                      {formatCurrency(
                        orders.reduce((sum, order) => sum + order.priceUSD, 0),
                        'USD'
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Revenue
                    </Typography>
                  </Box>
                  <AttachMoney sx={{ fontSize: 40, color: 'info.main', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters Section */}
        <Card sx={{ mb: 4, p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Orders"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
                }}
                placeholder="Search by order ID, buyer, or vehicle..."
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
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
            
            <Grid item xs={12} md={5}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setPage(1);
                  }}
                >
                  Clear Filters
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                  {filteredOrders.length} orders found
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Loading State */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={10}>
            <CircularProgress size={60} />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Loading orders...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <>
            {/* Orders Table */}
            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
              <Table>
                <TableHead sx={{ bgcolor: 'primary.light' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Order ID</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Buyer</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Vehicle</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price (USD)</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Converted Price</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Order Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedOrders.map((order) => (
                    <TableRow 
                      key={order._id}
                      hover
                      sx={{ 
                        '&:hover': { 
                          bgcolor: 'action.hover',
                          cursor: 'pointer'
                        }
                      }}
                      onClick={() => handleViewDetails(order)}
                    >
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {order._id}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 32, height: 32 }}>
                            <Person />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">{order.buyer?.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {order.buyer?.country}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="subtitle2">
                          {order.vehicle?.make} {order.vehicle?.model}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          VIN: {order.vehicle?.vin}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold" color="primary">
                          {formatCurrency(order.priceUSD, 'USD')}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="subtitle2">
                          {formatCurrency(order.convertedPrice, order.buyerCurrency)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.buyerCurrency}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        {getStatusChip(order.status)}
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(order.orderDate)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(order);
                              }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Edit Order">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditOrder(order._id);
                              }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="More Options">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuOpen(e, order._id);
                              }}
                            >
                              <MoreVert />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
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
            {filteredOrders.length === 0 && (
              <Box textAlign="center" py={10}>
                <Assignment sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No orders found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm ? `No results for "${searchTerm}"` : 'No orders in the system'}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  sx={{ mt: 2 }}
                  onClick={handleCreateOrder}
                >
                  Create New Order
                </Button>
              </Box>
            )}
          </>
        )}

        {/* Order Details Dialog */}
        <Dialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedOrder && (
            <>
              <DialogTitle>
                Order Details - {selectedOrder._id}
              </DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={3}>
                  {/* Order Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Order Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Order ID
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedOrder._id}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Status
                        </Typography>
                        <Box mt={1}>
                          {getStatusChip(selectedOrder.status)}
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Order Date
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(selectedOrder.orderDate)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          {selectedOrder.status === 'delivered' ? 'Delivery Date' : 'Estimated Delivery'}
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(selectedOrder.deliveryDate || selectedOrder.estimatedDelivery)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  {/* Buyer Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Buyer Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Name
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedOrder.buyer?.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Country
                        </Typography>
                        <Typography variant="body1">
                          {selectedOrder.buyer?.country}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1">
                          {selectedOrder.buyer?.email}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  {/* Vehicle Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Vehicle Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Make & Model
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedOrder.vehicle?.make} {selectedOrder.vehicle?.model}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Year
                        </Typography>
                        <Typography variant="body1">
                          {selectedOrder.vehicle?.year}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          VIN
                        </Typography>
                        <Typography variant="body1" fontFamily="monospace">
                          {selectedOrder.vehicle?.vin}
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
                          Price (USD)
                        </Typography>
                        <Typography variant="h5" color="primary" fontWeight="bold">
                          {formatCurrency(selectedOrder.priceUSD, 'USD')}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Converted Price
                        </Typography>
                        <Typography variant="h5" color="success.main" fontWeight="bold">
                          {formatCurrency(selectedOrder.convertedPrice, selectedOrder.buyerCurrency)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Shipping Method
                        </Typography>
                        <Typography variant="body1">
                          {selectedOrder.shippingMethod || 'Standard Shipping'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDetailsDialogOpen(false)}>
                  Close
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    handleEditOrder(selectedOrder._id);
                  }}
                >
                  Edit Order
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
              Are you sure you want to delete order {orderToDelete?._id}?
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
              const order = orders.find(o => o._id === selectedOrderId);
              if (order) handleViewDetails(order);
              handleMenuClose();
            }}
          >
            <Visibility sx={{ mr: 2 }} fontSize="small" />
            View Details
          </MenuItem>
          <MenuItem 
            onClick={() => {
              handleEditOrder(selectedOrderId);
              handleMenuClose();
            }}
          >
            <Edit sx={{ mr: 2 }} fontSize="small" />
            Edit Order
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={() => {
              const order = orders.find(o => o._id === selectedOrderId);
              if (order) handleDeleteClick(order);
              handleMenuClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 2 }} fontSize="small" />
            Delete Order
          </MenuItem>
        </Menu>
      </Container>
    </>
  );
}