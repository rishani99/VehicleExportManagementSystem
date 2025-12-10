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
  StepContent,
  LinearProgress,
  Tabs,
  Tab,
  Badge
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
  Person,
  LocationOn,
  Schedule,
  FlightTakeoff,
  FlightLand,
  DirectionsBoat,
  LocalAtm,
  TrackChanges,
  Map,
  QrCode,
  Notifications,
  Refresh,
  Share
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

// Shipment Status Configuration
const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'warning', icon: <Pending /> },
  booked: { label: 'Booked', color: 'info', icon: <Assignment /> },
  in_transit: { label: 'In Transit', color: 'primary', icon: <LocalShipping /> },
  at_port: { label: 'At Port', color: 'secondary', icon: <LocationOn /> },
  customs: { label: 'Customs Clearance', color: 'warning', icon: <Schedule /> },
  delivered: { label: 'Delivered', color: 'success', icon: <CheckCircle /> },
  delayed: { label: 'Delayed', color: 'error', icon: <Cancel /> },
  cancelled: { label: 'Cancelled', color: 'error', icon: <Cancel /> }
};

// Shipping Methods
const SHIPPING_METHODS = {
  sea: { label: 'Sea Freight', icon: <DirectionsBoat />, color: 'info' },
  air: { label: 'Air Freight', icon: <FlightTakeoff />, color: 'primary' },
  land: { label: 'Land Transport', icon: <LocalShipping />, color: 'success' }
};

// Ports data
const PORTS = {
  departure: ['Tokyo Port', 'Shanghai Port', 'Los Angeles Port', 'Hamburg Port', 'Singapore Port'],
  arrival: ['New York Port', 'Rotterdam Port', 'Dubai Port', 'Sydney Port', 'Miami Port']
};

export default function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shipmentToDelete, setShipmentToDelete] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedShipmentId, setSelectedShipmentId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  
  const navigate = useNavigate();

  // Get sample shipments for demonstration
  const getSampleShipments = () => {
    return [
      {
        _id: 'SHIP-2024-001',
        orderId: 'ORD-2024-001',
        containerNumber: 'CMAU1234567',
        trackingNumber: 'TRK7890123456',
        shippingMethod: 'sea',
        departurePort: 'Tokyo Port',
        arrivalPort: 'Los Angeles Port',
        departureDate: '2024-03-10',
        estimatedArrival: '2024-04-15',
        actualArrival: null,
        status: 'in_transit',
        carrier: 'Maersk Line',
        vessel: 'MAERSK EINDHOVEN',
        vehicleCount: 1,
        documents: ['Bill of Lading', 'Commercial Invoice'],
        notes: 'On schedule',
        createdAt: '2024-03-01'
      },
      {
        _id: 'SHIP-2024-002',
        orderId: 'ORD-2024-002',
        containerNumber: 'MSCU7654321',
        trackingNumber: 'TRK7890123457',
        shippingMethod: 'air',
        departurePort: 'Munich Airport',
        arrivalPort: 'New York JFK',
        departureDate: '2024-03-05',
        estimatedArrival: '2024-03-06',
        actualArrival: '2024-03-06',
        status: 'delivered',
        carrier: 'Lufthansa Cargo',
        flightNumber: 'LH827',
        vehicleCount: 1,
        documents: ['Air Waybill', 'Certificate of Origin'],
        notes: 'Delivered on time',
        createdAt: '2024-02-28'
      },
      {
        _id: 'SHIP-2024-003',
        orderId: 'ORD-2024-003',
        containerNumber: 'HLCU9876543',
        trackingNumber: 'TRK7890123458',
        shippingMethod: 'sea',
        departurePort: 'Shanghai Port',
        arrivalPort: 'Rotterdam Port',
        departureDate: '2024-03-01',
        estimatedArrival: '2024-04-10',
        actualArrival: null,
        status: 'at_port',
        carrier: 'Hapag-Lloyd',
        vessel: 'HAPAG-LLOYD EXPRESS',
        vehicleCount: 3,
        documents: ['Bill of Lading', 'Packing List'],
        notes: 'Waiting for customs clearance',
        createdAt: '2024-02-25'
      },
      {
        _id: 'SHIP-2024-004',
        orderId: 'ORD-2024-004',
        containerNumber: 'EITU2468135',
        trackingNumber: 'TRK7890123459',
        shippingMethod: 'land',
        departurePort: 'Hamburg Warehouse',
        arrivalPort: 'Paris Distribution Center',
        departureDate: '2024-03-08',
        estimatedArrival: '2024-03-10',
        actualArrival: null,
        status: 'in_transit',
        carrier: 'DHL Logistics',
        transportCompany: 'DB Schenker',
        vehicleCount: 2,
        documents: ['Transport Document', 'Insurance Certificate'],
        notes: 'Cross-border transport',
        createdAt: '2024-03-05'
      },
      {
        _id: 'SHIP-2024-005',
        orderId: 'ORD-2024-005',
        containerNumber: 'COSU1357924',
        trackingNumber: 'TRK7890123460',
        shippingMethod: 'sea',
        departurePort: 'Singapore Port',
        arrivalPort: 'Sydney Port',
        departureDate: '2024-02-20',
        estimatedArrival: '2024-03-15',
        actualArrival: '2024-03-18',
        status: 'delayed',
        carrier: 'COSCO Shipping',
        vessel: 'COSCO SHIPPING STAR',
        vehicleCount: 1,
        documents: ['Bill of Lading', 'Customs Declaration'],
        notes: 'Weather delay - 3 days',
        createdAt: '2024-02-15'
      },
      {
        _id: 'SHIP-2024-006',
        orderId: 'ORD-2024-006',
        containerNumber: 'APLU2468013',
        trackingNumber: 'TRK7890123461',
        shippingMethod: 'air',
        departurePort: 'Dubai Airport',
        arrivalPort: 'London Heathrow',
        departureDate: '2024-03-12',
        estimatedArrival: '2024-03-13',
        actualArrival: null,
        status: 'booked',
        carrier: 'Emirates SkyCargo',
        flightNumber: 'EK001',
        vehicleCount: 1,
        documents: ['Air Waybill'],
        notes: 'Scheduled for departure',
        createdAt: '2024-03-10'
      },
      {
        _id: 'SHIP-2024-007',
        orderId: 'ORD-2024-007',
        containerNumber: 'ONEU5790246',
        trackingNumber: 'TRK7890123462',
        shippingMethod: 'sea',
        departurePort: 'Los Angeles Port',
        arrivalPort: 'Tokyo Port',
        departureDate: '2024-03-03',
        estimatedArrival: '2024-04-05',
        actualArrival: null,
        status: 'customs',
        carrier: 'ONE (Ocean Network Express)',
        vessel: 'ONE COLUMBIA',
        vehicleCount: 4,
        documents: ['Bill of Lading', 'Certificate of Origin', 'Insurance'],
        notes: 'Customs inspection in progress',
        createdAt: '2024-02-28'
      },
      {
        _id: 'SHIP-2024-008',
        orderId: 'ORD-2024-008',
        containerNumber: 'YMLU8024579',
        trackingNumber: 'TRK7890123463',
        shippingMethod: 'land',
        departurePort: 'Beijing Warehouse',
        arrivalPort: 'Shanghai Port',
        departureDate: '2024-03-07',
        estimatedArrival: '2024-03-09',
        actualArrival: '2024-03-09',
        status: 'delivered',
        carrier: 'YML Logistics',
        transportCompany: 'China Rail',
        vehicleCount: 2,
        documents: ['Railway Bill', 'Delivery Note'],
        notes: 'Successfully delivered to port',
        createdAt: '2024-03-01'
      }
    ];
  };

  // Fetch shipments
  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = () => {
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      try {
        const sampleShipments = getSampleShipments();
        setShipments(sampleShipments);
        setError(null);
      } catch (err) {
        console.error('Error fetching shipments:', err);
        setError('Failed to load shipments. Using sample data instead.');
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  // Filter shipments based on search and filters
  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.containerNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.carrier?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || shipment.shippingMethod === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Pagination
  const totalPages = Math.ceil(filteredShipments.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedShipments = filteredShipments.slice(startIndex, startIndex + rowsPerPage);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate progress percentage
  const calculateProgress = (shipment) => {
    const statusOrder = ['pending', 'booked', 'in_transit', 'at_port', 'customs', 'delivered', 'delayed', 'cancelled'];
    const currentIndex = statusOrder.indexOf(shipment.status);
    return Math.round((currentIndex / (statusOrder.length - 1)) * 100);
  };

  // Get days remaining
  const getDaysRemaining = (estimatedArrival) => {
    if (!estimatedArrival) return null;
    const today = new Date();
    const arrivalDate = new Date(estimatedArrival);
    const diffTime = arrivalDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Handle view details
  const handleViewDetails = (shipment) => {
    setSelectedShipment(shipment);
    setDetailsDialogOpen(true);
  };

  // Handle edit shipment
  const handleEditShipment = (shipmentId) => {
    navigate(`/shipments/edit/${shipmentId}`);
  };

  // Handle delete shipment
  const handleDeleteClick = (shipment) => {
    setShipmentToDelete(shipment);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const handleDeleteConfirm = () => {
    setShipments(shipments.filter(shipment => shipment._id !== shipmentToDelete._id));
    setDeleteDialogOpen(false);
    setShipmentToDelete(null);
    
    alert(`Shipment ${shipmentToDelete._id} deleted successfully!`);
  };

  // Handle menu open
  const handleMenuOpen = (event, shipmentId) => {
    setMenuAnchor(event.currentTarget);
    setSelectedShipmentId(shipmentId);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedShipmentId(null);
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

  // Get shipping method chip
  const getMethodChip = (method) => {
    const config = SHIPPING_METHODS[method] || { label: method, color: 'default' };
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
    const dataStr = JSON.stringify(shipments, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'shipments-export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle create new shipment
  const handleCreateShipment = () => {
    navigate('/shipments/new');
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchShipments();
  };

  // Handle tracking
  const handleTrackShipment = (shipment) => {
    setSelectedShipment(shipment);
    setTrackingDialogOpen(true);
  };

  // Get shipment progress steps
  const getShipmentSteps = (shipment) => {
    const steps = [
      { label: 'Booked', status: shipment.status === 'booked' ? 'current' : 'completed' },
      { label: 'In Transit', status: shipment.status === 'in_transit' ? 'current' : 
        (['at_port', 'customs', 'delivered', 'delayed'].includes(shipment.status) ? 'completed' : 'pending') },
      { label: 'At Port', status: shipment.status === 'at_port' ? 'current' : 
        (['customs', 'delivered', 'delayed'].includes(shipment.status) ? 'completed' : 'pending') },
      { label: 'Customs', status: shipment.status === 'customs' ? 'current' : 
        (['delivered', 'delayed'].includes(shipment.status) ? 'completed' : 'pending') },
      { label: 'Delivered', status: shipment.status === 'delivered' ? 'current' : 
        (shipment.status === 'delayed' ? 'error' : 'pending') }
    ];
    
    if (shipment.status === 'cancelled') {
      return steps.map(step => ({ ...step, status: 'cancelled' }));
    }
    
    return steps;
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              <LocalShipping sx={{ mr: 1, verticalAlign: 'middle' }} />
              Shipments Management
            </Typography>
            <Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateShipment}
                sx={{ mr: 1 }}
              >
                New Shipment
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
            Track and manage all vehicle export shipments
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
                      {shipments.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Shipments
                    </Typography>
                  </Box>
                  <LocalShipping sx={{ fontSize: 40, color: 'primary.main', opacity: 0.8 }} />
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
                      {shipments.filter(s => s.status === 'in_transit' || s.status === 'at_port').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      In Transit
                    </Typography>
                  </Box>
                  <TrackChanges sx={{ fontSize: 40, color: 'warning.main', opacity: 0.8 }} />
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
                      {shipments.filter(s => s.status === 'delivered').length}
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
                    <Typography variant="h3" fontWeight="bold" color="error.main">
                      {shipments.filter(s => s.status === 'delayed' || s.status === 'cancelled').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Issues
                    </Typography>
                  </Box>
                  <Cancel sx={{ fontSize: 40, color: 'error.main', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs Section */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="All Shipments" icon={<LocalShipping />} iconPosition="start" />
            <Tab 
              label={
                <Badge badgeContent={shipments.filter(s => s.status === 'in_transit').length} color="warning">
                  <span>In Transit</span>
                </Badge>
              } 
              icon={<TrackChanges />} 
              iconPosition="start" 
            />
            <Tab 
              label={
                <Badge badgeContent={shipments.filter(s => s.status === 'delivered').length} color="success">
                  <span>Delivered</span>
                </Badge>
              } 
              icon={<CheckCircle />} 
              iconPosition="start" 
            />
            <Tab 
              label={
                <Badge badgeContent={shipments.filter(s => s.status === 'delayed' || s.status === 'cancelled').length} color="error">
                  <span>Issues</span>
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
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Shipments"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
                }}
                placeholder="Search by ID, container, tracking..."
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
                <InputLabel>Shipping Method</InputLabel>
                <Select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  label="Shipping Method"
                >
                  <MenuItem value="all">All Methods</MenuItem>
                  {Object.entries(SHIPPING_METHODS).map(([key, config]) => (
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
            
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setMethodFilter('all');
                    setPage(1);
                  }}
                >
                  Clear Filters
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                  {filteredShipments.length} shipments found
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
              Loading shipments...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <>
            {/* Shipments Table */}
            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
              <Table>
                <TableHead sx={{ bgcolor: 'primary.light' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Shipment ID</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Order ID</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Container/Tracking</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Route</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Method</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Progress</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedShipments.map((shipment) => {
                    const progress = calculateProgress(shipment);
                    const daysRemaining = getDaysRemaining(shipment.estimatedArrival);
                    
                    return (
                      <TableRow 
                        key={shipment._id}
                        hover
                        sx={{ 
                          '&:hover': { 
                            bgcolor: 'action.hover',
                            cursor: 'pointer'
                          }
                        }}
                        onClick={() => handleViewDetails(shipment)}
                      >
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {shipment._id}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="subtitle2" color="primary">
                            {shipment.orderId}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="subtitle2">
                            {shipment.containerNumber}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {shipment.trackingNumber}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              <FlightTakeoff fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                              {shipment.departurePort}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              <FlightLand fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                              {shipment.arrivalPort}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          {getMethodChip(shipment.shippingMethod)}
                        </TableCell>
                        
                        <TableCell>
                          {getStatusChip(shipment.status)}
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            <Typography variant="caption" display="block" color="text.secondary">
                              {progress}% Complete
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={progress} 
                              color={
                                shipment.status === 'delayed' ? 'error' :
                                shipment.status === 'delivered' ? 'success' :
                                'primary'
                              }
                              sx={{ height: 6, borderRadius: 3, mt: 0.5 }}
                            />
                            {daysRemaining !== null && shipment.status !== 'delivered' && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                {daysRemaining} days remaining
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
                                  handleViewDetails(shipment);
                                }}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Track Shipment">
                              <IconButton
                                size="small"
                                color="info"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTrackShipment(shipment);
                                }}
                              >
                                <TrackChanges />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="More Options">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMenuOpen(e, shipment._id);
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
            {filteredShipments.length === 0 && (
              <Box textAlign="center" py={10}>
                <LocalShipping sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No shipments found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm ? `No results for "${searchTerm}"` : 'No shipments in the system'}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  sx={{ mt: 2 }}
                  onClick={handleCreateShipment}
                >
                  Create New Shipment
                </Button>
              </Box>
            )}
          </>
        )}

        {/* Shipment Details Dialog */}
        <Dialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedShipment && (
            <>
              <DialogTitle>
                Shipment Details - {selectedShipment._id}
              </DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={3}>
                  {/* Shipment Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Shipment Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Shipment ID
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedShipment._id}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Order ID
                        </Typography>
                        <Typography variant="body1" color="primary">
                          {selectedShipment.orderId}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Container Number
                        </Typography>
                        <Typography variant="body1" fontFamily="monospace">
                          {selectedShipment.containerNumber}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Tracking Number
                        </Typography>
                        <Typography variant="body1" fontFamily="monospace">
                          {selectedShipment.trackingNumber}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  {/* Shipping Details */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Shipping Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Shipping Method
                        </Typography>
                        <Box mt={1}>
                          {getMethodChip(selectedShipment.shippingMethod)}
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Status
                        </Typography>
                        <Box mt={1}>
                          {getStatusChip(selectedShipment.status)}
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Carrier
                        </Typography>
                        <Typography variant="body1">
                          {selectedShipment.carrier}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          {selectedShipment.shippingMethod === 'air' ? 'Flight Number' : 
                           selectedShipment.shippingMethod === 'sea' ? 'Vessel' : 'Transport Company'}
                        </Typography>
                        <Typography variant="body1">
                          {selectedShipment.flightNumber || selectedShipment.vessel || selectedShipment.transportCompany}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  {/* Route Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Route Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Departure Port
                        </Typography>
                        <Typography variant="body1">
                          <LocationOn sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                          {selectedShipment.departurePort}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Arrival Port
                        </Typography>
                        <Typography variant="body1">
                          <LocationOn sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                          {selectedShipment.arrivalPort}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Departure Date
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(selectedShipment.departureDate)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Estimated Arrival
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(selectedShipment.estimatedArrival)}
                        </Typography>
                      </Grid>
                      {selectedShipment.actualArrival && (
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Actual Arrival
                          </Typography>
                          <Typography variant="body1" color="success.main">
                            {formatDate(selectedShipment.actualArrival)}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  {/* Progress Tracking */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Shipment Progress
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Stepper orientation="vertical" activeStep={calculateProgress(selectedShipment) / 20}>
                        {getShipmentSteps(selectedShipment).map((step, index) => (
                          <Step key={index} completed={step.status === 'completed'} active={step.status === 'current'}>
                            <StepLabel 
                              error={step.status === 'error'}
                              icon={
                                step.status === 'completed' ? <CheckCircle color="success" /> :
                                step.status === 'current' ? <TrackChanges color="primary" /> :
                                step.status === 'error' ? <Cancel color="error" /> :
                                <Pending color="disabled" />
                              }
                            >
                              {step.label}
                            </StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </Box>
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
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Number of Vehicles
                        </Typography>
                        <Typography variant="body1">
                          {selectedShipment.vehicleCount}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Documents
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                          {selectedShipment.documents?.map((doc, index) => (
                            <Chip key={index} label={doc} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Notes
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {selectedShipment.notes || 'No notes available'}
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
                  variant="outlined" 
                  color="info"
                  startIcon={<TrackChanges />}
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    handleTrackShipment(selectedShipment);
                  }}
                >
                  Track Shipment
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    handleEditShipment(selectedShipment._id);
                  }}
                >
                  Edit Shipment
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Tracking Dialog */}
        <Dialog
          open={trackingDialogOpen}
          onClose={() => setTrackingDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          {selectedShipment && (
            <>
              <DialogTitle>
                <TrackChanges sx={{ mr: 1, verticalAlign: 'middle' }} />
                Track Shipment - {selectedShipment._id}
              </DialogTitle>
              <DialogContent>
                <Box textAlign="center" py={3}>
                  <QrCode sx={{ fontSize: 150, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Tracking Number: {selectedShipment.trackingNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Scan this QR code or use the tracking number above to track your shipment on the carrier's website.
                  </Typography>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Current Status: {STATUS_CONFIG[selectedShipment.status]?.label}
                  </Typography>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Last Update: {formatDate(new Date().toISOString())}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Carrier: {selectedShipment.carrier}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Estimated Arrival: {formatDate(selectedShipment.estimatedArrival)}
                    </Typography>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setTrackingDialogOpen(false)}>
                  Close
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<Share />}
                  onClick={() => {
                    alert('Tracking link copied to clipboard!');
                    setTrackingDialogOpen(false);
                  }}
                >
                  Share Tracking
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
              Are you sure you want to delete shipment {shipmentToDelete?._id}?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This will also remove all tracking information.
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
              const shipment = shipments.find(s => s._id === selectedShipmentId);
              if (shipment) handleViewDetails(shipment);
              handleMenuClose();
            }}
          >
            <Visibility sx={{ mr: 2 }} fontSize="small" />
            View Details
          </MenuItem>
          <MenuItem 
            onClick={() => {
              const shipment = shipments.find(s => s._id === selectedShipmentId);
              if (shipment) handleTrackShipment(shipment);
              handleMenuClose();
            }}
          >
            <TrackChanges sx={{ mr: 2 }} fontSize="small" />
            Track Shipment
          </MenuItem>
          <MenuItem 
            onClick={() => {
              handleEditShipment(selectedShipmentId);
              handleMenuClose();
            }}
          >
            <Edit sx={{ mr: 2 }} fontSize="small" />
            Edit Shipment
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={() => {
              const shipment = shipments.find(s => s._id === selectedShipmentId);
              if (shipment) handleDeleteClick(shipment);
              handleMenuClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 2 }} fontSize="small" />
            Delete Shipment
          </MenuItem>
        </Menu>
      </Container>
    </>
  );
}