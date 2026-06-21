import { useState, useEffect, useContext } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch, createService, deleteService, getServices } from '../api/apiClient';
import { UserContext } from '../contexts/UserContexts';

export function ServicesPage() {
  const [service, setService] = useState({})
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [duration, setDuration] = useState('');
  const {user, accessToken, authReady} = useAuth();
  
  useEffect(() => {
    if(!authReady) return ;
    fetchServices()
  }, [authReady]);

  const handleCreateService = async (e) => {
    e.preventDefault();
    
    if(!service.name || !service.duration){
      alert("Name and Duration can't be empty")
      return;
    }

    const res = await createService(service, accessToken)
    if(res.data){
      setServices(prev => [...prev, res.data])
      alert(res.message)
    } else {
      alert(res.message)
    }
    setService({name:"", duration:""})
    return;
  };

  const handleDeleteService = async (id) => {
    const res = await deleteService(id, accessToken)
    
    if(res.success){
      const updatedServices = services.filter(s => s.id !== id);
      console.log(updatedServices)
      setServices(updatedServices);
      localStorage.setItem('services', JSON.stringify(updatedServices));
    }
    alert(res.message)
  

  };

  const  fetchServices =async () => {
    
    
    const services = await getServices(user.id, accessToken);
    console.log(services)
    setServices(services)
    if(!services){
      // Handle HTTP errors (404, 500, etc.)
      throw new Error(res.message || 'Something went wrong');
    }

  }

  return (
    <div className="space-y-6">
      
      <Card>
        <CardHeader>
          <CardTitle>Create New Service</CardTitle>
          <CardDescription>Add a new service to your salon</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateService} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service-name">Service Name</Label>
                <Input
                  id="service-name"
                  type="text"
                  placeholder="e.g., Haircut"
                  value={service.name}
                  onChange={(e) => setService(prev => ({...prev, name:e.target.value}))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="e.g., 30"
                  min="1"
                  value={service.duration}
                  onChange={(e) => setService(prev => ( { ...prev, duration:e.target.value} ))}
                  required
                />
              </div>
            </div>
            <Button type="submit">Add Service</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Services</CardTitle>
          <CardDescription>Manage your salon services</CardDescription>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No services yet. Create your first service above.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{service.duration} minutes</TableCell>
                    <TableCell>{new Date(service.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
