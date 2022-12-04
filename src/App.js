import React, { useState, useEffect } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faO } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function App() {
    let obj = {
        board: [],
    };

    const [data, setData] = useState(obj);
    const [loading, setLoading] = useState(true);

    const url = "ws://s.vominhduc.me:9000";
    const ws = new WebSocket(url);

    const matchesID = [];
    ws.onopen = () => {
        ws.send(
            JSON.stringify({
                action: 8,
            })
        );
        ws.onmessage = (e) => {
            let response = JSON.parse(e.data);
            response.matches.forEach((match) => {
                let obj = {
                    label: String(match.matchId),
                    id: match.matchId,
                };
                matchesID.push(obj);
            });
        };
    };
    const [match, setMatch] = useState(19);

    const initWebsocket = () => {
        ws.onopen = () => {
            ws.send(
                JSON.stringify({
                    action: 9,
                    match: match,
                })
            );
            ws.onmessage = (event) => {
                const response = JSON.parse(event.data);
                setData(response);
                setLoading(false);

                console.log(response);
            };
        };
    };
    useEffect(() => {
        initWebsocket();
    }, [match]);

    const [rows, setRows] = useState([]);
    const [row, setRow] = useState([]);

    useEffect(() => {
        let rows = [];

        for (let i = 0; i < data.board.length; i++) {
            let row = [];
            let className = "";
            let value = null;
            for (let j = 0; j < data.board[i].length; j++) {
                switch (data.board[i][j]) {
                    case -1:
                        className = "box blocked";
                        value = null;
                        break;
                    case 0:
                        className = "box empty";
                        value = null;
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

                row.push(
                    <td className={className}>
                        <div className="value-container">
                            {value ? <FontAwesomeIcon icon={value} /> : null}
                        </div>
                    </td>
                );
            }
            setRow(row);

            rows.push(<tr>{row}</tr>);
        }
        setRows(rows);

        setLoading(false);
    }, [data]);

    if (loading) return "Loading...";

    return (
        <div>
            <div className="main-container">
                <Autocomplete
                    options={matchesID}
                    onChange={(event, newMatch) => {
                        setMatch(newMatch.id);
                    }}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                        <TextField {...params} label="Match" />
                    )}
                />

                <table className="board">
                    <tbody>{rows}</tbody>
                </table>
            </div>
        </div>
    );
}
