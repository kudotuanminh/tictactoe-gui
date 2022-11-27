import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
    let obj = {
        column: 6,
        row: 4,
        grid: [
            [-1, 0, 0, 1, 1, 2],
            [0, 1, 0, 2, 1, 2],
            [0, 0, 2, 1, 1, 0],
            [0, 0, 0, -1, 0, 0],
        ],
    };

    const [data, setData] = useState(obj);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // var url = "https://randomuser.me/api";

    // useEffect(() => {
    //     fetch(url)
    //         .then((response) => {
    //             if (response.ok) {
    //                 return response.json();
    //             }
    //             throw response;
    //         })
    //         .then((data) => {
    //             setData(data);
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching data: ", error);
    //             setError(error);
    //         })
    //         .finally(() => {
    //             setLoading(false);
    //         });
    // });

    const [rows, setRows] = useState([]);
    const [column, setColumn] = useState([]);

    useEffect(() => {
        let rows = [];
        for (let i = 0; i < data.row; i++) {
            let row = [];
            let className = "";
            let value = "";
            for (let j = 0; j < data.column; j++) {
                switch (data.grid[i][j]) {
                    case -1:
                        className = "blocked";
                        value = "";
                        break;
                    case 0:
                        className = "empty";
                        value = "";
                        break;
                    case 1:
                        className = "player-1";
                        value = "X";
                        break;
                    case 2:
                        className = "player-2";
                        value = "O";
                        break;
                    default:
                        break;
                }
                row.push(
                    <td className={className}>
                        <div className="value-container">{value}</div>
                    </td>
                );
            }
            setColumn(row);

            rows.push(<tr>{row}</tr>);
        }
        setRows(rows);

        setLoading(false);
    }, []);

    if (loading) return "Loading...";
    if (error) return "Error!";

    return (
        <div className="main-container">
            <table className="board">
                <tbody>{rows}</tbody>
            </table>
        </div>
    );
}
