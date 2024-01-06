import { useEffect, useState } from 'react';
import './App.css';
// import axios from 'axios';
import api from './axios/api';

function App() {
    const [todos, setTodos] = useState(null);
    const [inputValue, setInputValue] = useState({
        title: '',
    });
    const [targetId, setTargetId] = useState('');
    const [contents, setContents] = useState('');

    // 조회 함수 // 비동기 함수 : 서버(json-server)에 todos를 요청하는 함수
    const fetchTodos = async () => {
        // const { data } = await axios.get('http://localhost:4000/todos');
        // const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/todos`);
        const { data } = await api.get("/todos");
        // console.log('data', data);
        setTodos(data);
    };

    // 추가 함수
    const onSubmitHandler = async () => {
      api.post("/todos", inputValue);
        // setTodos([...todos, inputValue]);
        fetchTodos();
    };

    // 삭제 함수
    const onDeleteBtnClickHandler = async (id) => {
      api.delete(`/todos/${id}`);
        setTodos(
            todos.filter((item) => {
                return item.id !== id;
            })
        );
    };

    // 수정 함수
    const onUpdateBtnClickHandler = async () => {
      api.patch(`/todos/${targetId}`, {
            title: contents,
        });

        setTodos(
            todos.map((item) => {
                if (item.id == targetId) {
                    return { ...item, title: contents };
                } else {
                    return item;
                }
            })
        );
    };

    useEffect(() => {
        // db로 부터 값을 가져올 것이다.
        fetchTodos();
    }, []);

    return (
        <>
            <div>
                {/* 수정 영역 */}
                <input
                    type="text"
                    placeholder="수정할 아이디"
                    value={targetId}
                    onChange={(e) => {
                        setTargetId(e.target.value);
                    }}
                />
                <input
                    type="text"
                    placeholder="수정할 내용"
                    value={contents}
                    onChange={(e) => {
                        setContents(e.target.value);
                    }}
                />
                <button onClick={onUpdateBtnClickHandler}>수정</button>
                <br />
                <br />
            </div>
            <div>
                {/* input영역 */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();

                        // 버튼 클릭시, input에 들어있는 값(state)을 이용하여 DB에 저장(post요청)
                        onSubmitHandler();
                    }}
                >
                    <input
                        type="text"
                        value={inputValue.title}
                        onChange={(e) => {
                            setInputValue({
                                title: e.target.value,
                            });
                        }}
                    />
                    <button type="submit">추가</button>
                </form>
            </div>

            <div>
                {/* 데이터 영역 */}
                {todos?.map((item) => {
                    return (
                        <div key={item.id}>
                            {item.id} : {item.title}
                            &nbsp;<button onClick={() => onDeleteBtnClickHandler(item.id)}>삭제</button>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default App;
