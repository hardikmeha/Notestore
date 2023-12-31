import { useEffect, useState } from 'react';
import NoteContext from './NoteContext';
const API_BASE_URL = 'https://notestore2.onrender.com';
const NoteState = (props) => {
  const [notes, setNote] = useState([]);
  const [token, setToken] = useState('');
  const [alert, setAlert] = useState(null);
  const [newnote, setNewnote] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const showAlert = (msg, type) => {
    setAlert({
      msg,
      type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };
  const getAllNotes = async () => {
    console.log('Fetch all notes');
    try {
      const response = await fetch(
        'https://notestore2.onrender.com/api/note/allnotes',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem('token'),
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const newnotes = notes.concat(data.notes);
      setNote([...data.notes]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    console.log(notes);
  }, [notes]);
  // const update = () => {
  //   setTimeout(() => {
  //     setState({
  //       name: 'lardik',
  //       class: '11',
  //     });
  //   }, 2000);
  // };
  const addNote = async ({ title, description, tag }) => {
    if (title.length < 3) throw new Error('Minimum title length should be 3');
    if (description.length < 5)
      throw new Error('Minimum description length should be 5');
    try {
      const response = await fetch(
        'https://notestore2.onrender.com/api/note/addnote',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem('token'),
          },
          body: JSON.stringify({ title, description, tag }),
        }
      );
      if (!response.ok) throw new Error('Note cannot be added');
      const data = await response.json();
      console.log(data);
      setNote(notes.concat(data.note));
      showAlert('Note added successfully', 'success');
      console.log(notes); //Concat returns an array while push updates an array.
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  };
  const deleteNote = async (note) => {
    try {
      const response = await fetch(
        `https://notestore2.onrender.com/api/note/deletenote/${note._id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem('token'),
          },
        }
      );
      if (!response.ok) throw new Error('Note cannot be deleted');
      const data = await response.json();

      const newnotes = notes.filter((n) => {
        return n._id !== note._id;
      });
      setNote(newnotes);
      showAlert('Note deleted succesfully', 'success');
      console.log(notes);
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  };
  const editNote = async ({ _id, title, description, tag }) => {
    try {
      const response = await fetch(
        `https://notestore2.onrender.com/api/note/updatenote/${_id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem('token'),
          },
          body: JSON.stringify({ title, description, tag }),
        }
      );
      if (!response.ok) throw new Error('Note cannot be updated');
      const data = await response.json();
      showAlert('Note updated successfully', 'success');
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  };

  return (
    // When we wrap anything between noteState it provides the value as state and update to all the components present in between it  and also to its children
    <NoteContext.Provider
      value={{
        notes,
        setNote,
        addNote,
        deleteNote,
        editNote,
        getAllNotes,
        setToken,
        token,

        showAlert,
        alert,
        newnote,
        setNewnote,
        title,
        setTitle,
        description,
        setDescription,
        tag,
        setTag,
      }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};
export default NoteState;
