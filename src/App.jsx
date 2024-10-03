import { useEffect, useState } from "react";
import Auth from "./components/auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [movies, setMovies] = useState([]);
  const moviesCollection = collection(db, "movies");
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newMovieReleaseDate, setNewMovieReleaseDate] = useState(0);
  const [newMovieGenre, setNewMovieGenre] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatingMovieId, setUpdatingMovieId] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const data = await getDocs(moviesCollection);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMovies(filteredData);
      } catch (error) {
        console.log(error);
      }
    };
    getMovies();
  }, [movies]);

  const addNewMovie = async () => {
    try {
      const data = await addDoc(moviesCollection, {
        title: newMovieTitle,
        releaseDate: newMovieReleaseDate,
        genre: newMovieGenre,
        userId: auth?.currentUser?.uid,
      });
      alert("Movie added");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMovie = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await deleteDoc(movieDoc);
    } catch (error) {
      console.log(error);
    }
  };

  const editMovie = (id) => {
    const movie = movies.find((m) => m.id == id);
    setUpdatingMovieId(movie.id);
    if (movie) setIsEdit(!isEdit);
  };

  const updateMovie = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await updateDoc(movieDoc, {
        title: updatedTitle,
      });
      setUpdatedTitle("");
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async () => {
    if (!image) return null;
    const imageRef = ref(storage, `images/${image.name}`);
    try {
      const file = uploadBytes(imageRef, image);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Auth />
      {movies?.map((movie) => (
        <div
          key={movie.id}
          style={{
            border: "2px solid black",
            marginBottom: "12px",
            width: "420px",
            padding: "10px",
          }}
        >
          <h1>
            Title : {movie.title}{" "}
            <button onClick={() => deleteMovie(movie.id)}>Delete</button>{" "}
          </h1>
          <p>Release Year : {movie.releaseDate}</p>
          <p>Genre : {movie.genre}</p>
          <button onClick={() => editMovie(movie.id)}>Edit</button>
          {isEdit && updatingMovieId === movie.id && (
            <>
              <input
                type="text"
                placeholder="Enter new title.."
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
              />
              <button onClick={() => updateMovie(movie.id)}>Update</button>
            </>
          )}
        </div>
      ))}
      <h2>Add a new Movie</h2>

      <input
        type="text"
        placeholder="Movie title.."
        value={newMovieTitle}
        onChange={(e) => setNewMovieTitle(e.target.value)}
      />

      <br />
      <label>Release Date : </label>
      <input
        type="number"
        value={newMovieReleaseDate}
        onChange={(e) => setNewMovieReleaseDate(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Genre.."
        value={newMovieGenre}
        onChange={(e) => setNewMovieGenre(e.target.value)}
      />
      <br />
      <button onClick={addNewMovie}>Add new Movie</button>
      <div>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button onClick={uploadImage}>Upload file</button>
      </div>
    </>
  );
}

export default App;
