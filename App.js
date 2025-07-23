import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './Screens/HomeScreen';
import Profile from './Screens/Profile';
import NewsScreen from './Screens/News';
import Service from './Screens/Service';
import Contact from './Screens/Contact';
import SearchResult from './Components/SearchResult'; 
import BangGia from './Screens/Banggia';
import GiaResult from './Screens/giaresult';
import Dulieu from './Screens/Dulieu';
import Introdure from './Screens/Introdure';
import WebviewScreen from './Screens/WebviewScreen'; // hoặc đường dẫn tương ứng
import Login from './Screens/Login';
import Register from './Screens/Register';
import UserProfile from './Screens/UserProfile';
import Adminscreen from './Admin/Adminscreen';
import AdminContactform from './Admin/AdminContactform';
import AdminUserManager from './Admin/AdminUserManager';
import AdminDataManager from './Admin/AdminDataManager';
import AdminNewManager from './Admin/AdminNewManager';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen"> 
        <Stack.Screen name="Login" 
        component={Login} 
        options={{ headerShown: false }} 
        />
        <Stack.Screen name="Register"
         component={Register} 
         options={{ headerShown: false }}
         />
        <Stack.Screen name="HomeScreen"
         component={HomeScreen} 
         />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ title: 'Giới thiệu' }}
        />
        <Stack.Screen
          name="NewsScreen"
          component={NewsScreen}
          options={{ title: 'Tin tức' }}
        />
        <Stack.Screen
            name="ServiceScreen"
            component={Service}
            options={{ title: 'Dịch vụ' }}
            />
        <Stack.Screen
            name="Contact"
            component={Contact}
            options={{ title: 'Liên hệ' }}
            />
          <Stack.Screen name="SearchResult" 
          component={SearchResult} 
          options={{ title: 'Kết quả tìm kiếm' }} 
          />
        <Stack.Screen name="BangGia" 
        component={BangGia} />
        <Stack.Screen name="GiaResult" 
        component={GiaResult} /> 
         <Stack.Screen
          name="Introdure"
          component={Introdure}
          options={{ title: 'Tài liệu' }}
        />
         <Stack.Screen
          name="Dulieu"
          component={Dulieu}
          options={{ title: 'Dữ liệu Quan trắc' }}
        />
          <Stack.Screen name="WebviewScreen" 
          component={WebviewScreen} 
          options={{ title: 'Chi tiết tin' }} />
        <Stack.Screen name="UserProfile" 
          component={UserProfile} 
          options={{ title: 'Thông tin cá nhân' }} />
          <Stack.Screen name='Adminscreen'
          component={Adminscreen}
          />
          <Stack.Screen name='AdminContactform'
          component={AdminContactform}
          />
          <Stack.Screen name='AdminUserManager'
          component={AdminUserManager}
          />
          <Stack.Screen name='AdminDataManager'
          component={AdminDataManager}
          />
          <Stack.Screen name='AdminNewManager'
          component={AdminNewManager}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
