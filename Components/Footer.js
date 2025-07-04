import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>
        Địa chỉ: Số 26 Huỳnh Văn Nghệ, Phường Phú Lợi, TP. Hồ Chí Minh.</Text>
        
        <Text style={styles.text}>Điện thoại: 0274 3824 753</Text>
       <Text style={styles.text}> Email: quantrac.tnmt@binhduong.gov.vn</Text>

        <Text style={styles.text}>Website: Moitruongbinhduong.gov.vn</Text>

      
      
      
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#1B6A77',
    paddingHorizontal: 16,
  },
  text: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Footer;
