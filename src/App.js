import React, { useState, useEffect } from 'react';

const App = () => {
  const [value, setValue] = useState('')
  const [message, setMessage] = useState(null)
  const [previousChats, setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }
  const handleClick = (uniqeTitle) => {
    setCurrentTitle(uniqeTitle)
    setValue('')
    setMessage(null)
  }
  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await fetch('http://localhost:8000/completions', options);
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(currentTitle, value, message);
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats(prevChats => (
        [...prevChats, {
          title: currentTitle,
          role: "user",
          content: value
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content
        },
        ]
      ))
    }
  }, [message, currentTitle])

  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
  const uniqeTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
  return (
    <div className='app'>
      <section className='side-bar'>
        <button onClick={createNewChat}>+ New chat</button>
        <ul className='history'>
          {uniqeTitles?.map((uniqeTitle, index) => <li key={index} onClick={handleClick}>{uniqeTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Oded Haina</p>
        </nav>
      </section>
      <section className='main'>
        {!currentTitle && <h1>OdedGPT</h1>}
        <ul className='feed'>
          {currentChat?.map((chatMessage, index) => <li key={index}>
            <p className='role'>{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className='bottom-section'>
          <div className='input-container'>
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <div id='submit' onClick={getMessages}>➟</div>
          </div>
          <p className='info'>
            OdedGPT, an advanced language model developed by OpenAI. Trained on diverse topics until September 2021, I generate human-like text and can assist with information, creative writing, and conversations. My knowledge isn't current, and I lack personal emotions and experiences.
          </p>
        </div>
      </section>
    </div>
  );
};

export default App;
