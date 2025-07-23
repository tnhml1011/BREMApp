import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Footer = () => {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const doc = await firestore().collection('lienhe').doc('main').get();
        if (doc.exists) {
          setContact(doc.data());
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu footer:', error);
      }
    };

    fetchContact();
  }, []);

  if (!contact) return null;

  return (
    <View style={styles.footer}>
      <Text style={styles.text}>{contact.tentt}</Text>
      <Text style={styles.text}>Địa chỉ: {contact.diachi}</Text>
      <Text style={styles.text}>Điện thoại: {contact.sdt} | {contact.didong}</Text>
      <Text style={styles.text}>Email: {contact.email}</Text>
      <Text style={styles.text}>Website: {contact.website}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 15,
    backgroundColor: '#1B6A77',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 3,
  },
});

export default Footer;
