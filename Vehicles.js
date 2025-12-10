import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fab,
  Switch,
  FormControlLabel,
  CardActions
} from '@mui/material';
import {
  Search,
  Add,
  FilterList,
  Edit,
  Delete,
  Visibility,
  ShoppingCart,
  LocalShipping,
  CheckCircle,
  Warning,
  DirectionsCar,
  AttachMoney,
  Print,
  Share
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Vehicle Status Configuration
const STATUS_CONFIG = {
  available: { label: 'Available', color: 'success' },
  reserved: { label: 'Reserved', color: 'warning' },
  sold: { label: 'Sold', color: 'error' },
  in_transit: { label: 'In Transit', color: 'info' }
};

// Vehicle Makes for Filter
const VEHICLE_MAKES = [
  'Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi',
  'Volkswagen', 'Nissan', 'Hyundai', 'Kia', 'Mazda'
];

// Sample Vehicle Data
const SAMPLE_VEHICLES = [
  {
    id: 1,
    vin: '1HGCM82633A123456',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    color: 'White',
    price: 28500,
    currency: 'USD',
    mileage: 15000,
    engineType: '2.5L 4-Cylinder',
    transmission: 'Automatic',
    status: 'available',
    location: 'Tokyo, Japan',
    specifications: { seats: 5, features: ['Leather Seats', 'Sunroof', 'Navigation'] },
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    vin: '5XYZU3LBXGG123789',
    make: 'BMW',
    model: 'X5',
    year: 2024,
    color: 'Black',
    price: 68500,
    currency: 'USD',
    mileage: 5000,
    engineType: '3.0L Turbo',
    transmission: 'Automatic',
    status: 'reserved',
    location: 'Munich, Germany',
    specifications: { seats: 7, features: ['Panoramic Roof', 'Heated Seats', 'Premium Sound'] },
    createdAt: '2024-02-10'
  },
  {
    id: 3,
    vin: 'WAUZZZ8K9BA123654',
    make: 'Audi',
    model: 'A4',
    year: 2023,
    color: 'Gray',
    price: 42500,
    currency: 'USD',
    mileage: 12000,
    engineType: '2.0L Turbo',
    transmission: 'Automatic',
    status: 'in_transit',
    location: 'Hamburg Port',
    specifications: { seats: 5, features: ['Virtual Cockpit', 'Matrix LED'] },
    createdAt: '2024-01-20'
  }
];

const Vehicles = () => {
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState(SAMPLE_VEHICLES);
  const [filteredVehicles, setFilteredVehicles] = useState(SAMPLE_VEHICLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMake, setSelectedMake] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(6);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Simulate API load
  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  }, []);

  // Filter vehicles
  useEffect(() => {
    let filtered = [...vehicles];

    if (searchTerm) {
      filtered = filtered.filter(v =>
        v.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(v => v.status === selectedStatus);
    }

    if (selectedMake !== 'all') {
      filtered = filtered.filter(v => v.make === selectedMake);
    }

    if (minPrice) filtered = filtered.filter(v => v.price >= parseInt(minPrice));
    if (maxPrice) filtered = filtered.filter(v => v.price <= parseInt(maxPrice));

    setFilteredVehicles(filtered);
    setPage(1);
  }, [searchTerm, selectedStatus, selectedMake, minPrice, maxPrice, vehicles]);

  // Handlers
  const formatPrice = (price, currency) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);

  const getStatusChip = (status) => {
    const config = STATUS_CONFIG[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" variant="outlined" sx={{ fontWeight: 500 }} />;
  };

  const handleDeleteClick = (vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (vehicleToDelete) {
      setVehicles(prev => prev.filter(v => v.id !== vehicleToDelete.id));
      setSnackbar({ open: true, message: `Vehicle ${vehicleToDelete.vin} deleted`, severity: 'success' });
    }
    setDeleteDialogOpen(false);
    setVehicleToDelete(null);
  };

  const handleViewDetails = (id) => navigate(`/vehicles/${id}`);
  const handleEditVehicle = (id) => navigate(`/vehicles/${id}/edit`);
  const handleCreateOrder = (id) => navigate(`/orders/new?vehicleId=${id}`);

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedVehicles = filteredVehicles.slice(startIndex, startIndex + rowsPerPage);

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ pt: 12, pb: 12}}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              <DirectionsCar sx={{ mr: 1, verticalAlign: 'middle' }} />
              Vehicle Inventory
            </Typography>
            <Box>
              <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/vehicles/new')} sx={{ mr: 1 }}>Add Vehicle</Button>
              <Button variant="outlined" startIcon={<Print />} onClick={() => window.print()}>Print</Button>
            </Box>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Manage your vehicle inventory, track status, and process orders
          </Typography>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 4, p: 3, borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterList sx={{ mr: 1 }} /> Filters & Search
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Search VIN, Make, Model" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} label="Status">
                  <MenuItem value="all">All Status</MenuItem>
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <MenuItem key={key} value={key}>
                      <Chip label={config.label} size="small" color={config.color} sx={{ mr: 1 }} /> {config.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Make</InputLabel>
                <Select value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)} label="Make">
                  <MenuItem value="all">All Makes</MenuItem>
                  {VEHICLE_MAKES.map(make => <MenuItem key={make} value={make}>{make}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField fullWidth type="number" label="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField fullWidth type="number" label="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={<Switch checked={viewMode === 'list'} onChange={(e) => setViewMode(e.target.checked ? 'list' : 'grid')} />}
                  label="List View"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent="space-between">
                  <Button variant="outlined" onClick={() => { setSearchTerm(''); setSelectedStatus('all'); setSelectedMake('all'); setMinPrice(''); setMaxPrice(''); }}>Clear Filters</Button>
                  <Select size="small" value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                    <MenuItem value="GBP">GBP (£)</MenuItem>
                  </Select>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Card>

        {/* Loading */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={10}>
            <CircularProgress size={60} />
            <Typography variant="body1" sx={{ ml: 2 }}>Loading vehicles...</Typography>
          </Box>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' ? (
              <Grid container spacing={3}>
                {paginatedVehicles.map(vehicle => (
                  <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                          <Typography variant="h6" fontWeight="bold">{vehicle.year} {vehicle.make} {vehicle.model}</Typography>
                          {getStatusChip(vehicle.status)}
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>VIN: {vehicle.vin}</Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>{vehicle.engineType} • {vehicle.transmission} • {vehicle.mileage.toLocaleString()} km</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>📍 {vehicle.location}</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                          {vehicle.specifications.features.map((feature, i) => <Chip key={i} label={feature} size="small" variant="outlined" />)}
                        </Box>
                        <Typography variant="h5" color="primary" fontWeight="bold">{formatPrice(vehicle.price, selectedCurrency)}</Typography>
                      </CardContent>
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Button fullWidth variant="outlined" size="small" startIcon={<Visibility />} onClick={() => handleViewDetails(vehicle.id)}>View</Button>
                          </Grid>
                          <Grid item xs={6}>
                            <Button fullWidth variant="contained" size="small" startIcon={<ShoppingCart />} onClick={() => handleCreateOrder(vehicle.id)} disabled={vehicle.status !== 'available'}>Order</Button>
                          </Grid>
                          <Grid item xs={12} sx={{ mt: 1 }}>
                            <Box display="flex" justifyContent="space-between">
                              <IconButton size="small" color="primary" onClick={() => handleEditVehicle(vehicle.id)}><Edit /></IconButton>
                              <IconButton size="small" color="error" onClick={() => handleDeleteClick(vehicle)}><Delete /></IconButton>
                              <IconButton size="small" color="info"><Share /></IconButton>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              // List view can be added here similarly
              <Typography variant="h6">List view coming soon...</Typography>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination count={totalPages} page={page} onChange={(e, value) => setPage(value)} color="primary" size="large" />
              </Box>
            )}
          </>
        )}

        {/* Floating Action Button */}
        <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 30, right: 30 }} onClick={() => navigate('/vehicles/new')}>
          <Add />
        </Fab>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete vehicle {vehicleToDelete?.vin}?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default Vehicles;
