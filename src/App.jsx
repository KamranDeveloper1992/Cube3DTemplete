import React, { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Html, useProgress, Center } from '@react-three/drei'
import { useGLTF } from '@react-three/drei'
import PropTypes from 'prop-types'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const drawerWidth = 240
const navItems = ['Home', 'About', 'Contact']

function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress.toFixed(0)} % loaded</Html>
}

function Model({ path }) {
  const gltf = useGLTF(path)

  useEffect(() => {
    gltf.scene.rotation.y = Math.PI / 4
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.metalness = 1
        child.material.roughness = 0.05
        child.material.envMapIntensity = 2
        child.material.needsUpdate = true
      }
    })
  }, [gltf])

  return <primitive object={gltf.scene} scale={[0.5, 0.5, 0.5]} />
}

function App(props) {
  const { window } = props
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState)
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        CUBE
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  const container = window !== undefined ? () => window().document.body : undefined

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            CUBE
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: '#fff' }}>
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}>
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ p: 3, width: '100%' }}>
        <Toolbar />
        <Canvas
          shadows
          camera={{ position: [0, 2, 5], fov: 50 }}
          style={{
            position: 'absolute',
            top: 64,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: 'calc(100vh - 64px)',
            zIndex: 1,
          }}>
          <Suspense fallback={<Loader />}>
            <Environment preset="city" background={false} />
            <Center>
              <Model path="/cube_runner.glb" />
            </Center>

            <Html
              position={[0, 1.5, 0]}
              center
              style={{
                color: 'white',
                fontSize: '2rem',
                fontWeight: 'bold',
                background: 'rgba(0,0,0,0.5)',
                padding: '8px 16px',
                borderRadius: '8px',
                pointerEvents: 'none',
                fontSize: '30px',
              }}>
              <h2>3DCubeTemplete</h2>
            </Html>

            <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
          </Suspense>
        </Canvas>
      </Box>
    </Box>
  )
}

App.propTypes = {
  window: PropTypes.func,
}

export default App
