import React, { useState, useEffect } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faO } from "@fortawesome/free-solid-svg-icons";

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
        winner: "Player 1",
        winMoves: [(0, 4), (1, 4), (2, 4)],
    };

    const [data, setData] = useState(obj);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [winner, setWinner] = useState(null);

    // const url = "https://randomuser.me/api";

    const [rows, setRows] = useState([]);
    const [row, setRow] = useState([]);

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

    useEffect(() => {
        if (data.winner) {
            setWinner(data.winner);
        }

        let rows = [];
        for (let i = 0; i < data.row; i++) {
            let row = [];
            let className = "";
            let value = "";
            for (let j = 0; j < data.column; j++) {
                switch (data.grid[i][j]) {
                    case -1:
                        className = "box blocked";
                        value = "";
                        break;
                    case 0:
                        className = "box empty";
                        value = "";
                        break;
                    case 1:
                        className = "box player-1";
                        value = faXmark;
                        break;
                    case 2:
                        className = "box player-2";
                        value = faO;
                        break;
                    default:
                        break;
                }
                //  TODO: check winMoves
                if (null) {
                    className += " win";
                }

                row.push(
                    <td className={className}>
                        <div className="value-container">
                            <FontAwesomeIcon icon={value} />
                        </div>
                    </td>
                );
            }
            setRow(row);

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
            <h1 className="announcement">{winner} wins!</h1>
        </div>
    );
}
