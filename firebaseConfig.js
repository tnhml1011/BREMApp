import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAuhJXzsujtgdwiNYyNNaRe6IFefxz_kmQ",
  authDomain: "brem-82e48.firebaseapp.com", // bạn thêm thủ công
  projectId: "brem-82e48",                  // 🔥 PHẢI CÓ
  storageBucket: "brem-82e48.appspot.com",  // sửa đúng đuôi
  messagingSenderId: "548387353397",
  appId: "1:548387353397:android:5de4b9701b08c02f0a927c"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Các service bạn muốn dùng
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
