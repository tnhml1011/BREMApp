import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const GiaResult = ({ route }) => {
  const { title, pdfUrl } = route.params;
  const encodedUrl = encodeURIComponent(pdfUrl);
  const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodedUrl}`;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
      <WebView
        source={{ uri: viewerUrl }}
        style={styles.webview}
        originWhitelist={['*']}
        useWebKit={true}
        startInLoadingState={true}
        renderError={(errorName) => (
          <Text style={{ color: 'red', padding: 20 }}>Không thể tải PDF: {errorName}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    color: '#004d40',
  },
  webview: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
});

export default GiaResult;
