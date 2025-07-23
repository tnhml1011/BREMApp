import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'PHÒNG HÀNH CHÍNH TỔNG HỢP',
    image: {
      uri: 'https://moitruongbinhduong.gov.vn/thumb/1366x570/1/upload/hinhanh/6-1162.png',
    },
  },
  {
    id: 2,
    image: {
      uri: 'https://moitruongbinhduong.gov.vn/thumb/1366x570/1/upload/hinhanh/1-8020.png',
    },
  },
  {
    id: 3,
    title: 'PHÒNG THỬ NGHIỆM',
    image: {
      uri: 'https://moitruongbinhduong.gov.vn/thumb/1366x570/1/upload/hinhanh/2-1295.png',
    },
  },
  {
    id: 4,
    title: 'PHÒNG QUAN TRẮC HIỆN TRƯỜNG',
    image: {
      uri: 'https://moitruongbinhduong.gov.vn/thumb/1366x570/1/upload/hinhanh/3-4349.png',
    },
  },
  {
    id: 5,
    title: 'PHÒNG TƯ VẤN CÔNG NGHỆ',
    image: {
      uri: 'https://moitruongbinhduong.gov.vn/thumb/1366x570/1/upload/hinhanh/4-4053.png',
    },
  },
  {
    id: 6,
    title: 'PHÒNG QUAN TRẮC TỰ ĐỘNG & DỮ LIỆU ',
    image: {
      uri: 'https://moitruongbinhduong.gov.vn/thumb/1366x570/1/upload/hinhanh/5-8490.png',
    },
  },
  {
    id: 7,
    title: 'PHÒNG KẾ HOẠCH TÀI CHÍNH ',
    image: {
      uri: 'https://moitruongbinhduong.gov.vn/thumb/1366x570/1/upload/hinhanh/7-5349.png',
    },
  },
];

const Carousel = () => {
  const scrollViewRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slideIndex);
  };

  // Tự động chuyển slide
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      scrollViewRef.current.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000); // mỗi 3 giây

    return () => clearInterval(interval); // Clear khi component unmount
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <Image source={slide.image} style={styles.image} />
            {slide.title && (
              <View style={styles.overlay}>
                <Text style={styles.title}>{slide.title}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Dots indicator */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.activeDot : null,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 240,
    marginBottom: 10,
  },
  slide: {
    width,
    height: 230,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '80%',
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0, 80, 100, 0.7)',
    padding: 8,
    borderRadius: 6,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#bbb',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#1B6A77',
    width: 10,
    height: 10,
  },
});

export default Carousel;
