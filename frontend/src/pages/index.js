import { useRouter } from 'next/router';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'


import { styled } from '@mui/material/styles'

import MuiCard from '@mui/material/Card'
import BlankLayout from 'src/@core/layouts/BlankLayout'


const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const IndexPage = () => {

  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [users, setUsers] = useState([]);

  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  if (isLoggedIn) {
    router.push('/contacts');
  }
  
  // atualizar o token jwt
  const refreshToken = async () => {

    try {
        const response = await axios.get('http://localhost:5000/token');
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setName(decoded.name);
        setExpire(decoded.exp);

    } catch (error) {
        if (error.response) {
            history.push("/");
        }
    }

  }

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async (config) => {

      const currentDate = new Date();

      if (expire * 1000 < currentDate.getTime()) {
          const response = await axios.get('http://localhost:5000/token');
          config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          setName(decoded.name);
          setExpire(decoded.exp);
      }

      return config;

  }, (error) => {
      return Promise.reject(error);
  });

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
            <Typography
                variant='h6'
                sx={{
                  ml: 3,
                  lineHeight: 1,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '1.5rem !important'
                }}
              >
                BEM-VINDO
            </Typography>
          </Box>
              {!isLoggedIn && (
                <Button
                  fullWidth
                  size='large'
                  onClick={() => router.push('/login')}
                  variant="contained"
                  sx={{ marginBottom: 3.5}}
                >
                  Fazer login
                </Button>
              )}
              {!isLoggedIn && (
                <Button
                  fullWidth
                  size='large'
                  onClick={() => router.push('/register')}
                  variant="contained"
                >
                  Cadastrar-se
                </Button>
              )}
        </CardContent>
      </Card>
    </Box>
  );
};

IndexPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default IndexPage;