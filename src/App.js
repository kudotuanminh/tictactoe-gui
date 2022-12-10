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

    const [ws, setWs] = useState();
    const [ws2, setWs2] = useState();
    const [data, setData] = useState(obj);
    const [loading, setLoading] = useState(true);
    const [matchesID, setMatchesID] = useState([]);
    const [matchesInfo, setMatchesInfo] = useState([]);

    const url = "ws://s.vominhduc.me:9000";

    function constructWs1() {
        let ws1 = new WebSocket(url);
        ws1.onopen = () => {
            console.log("new connection 8");
            ws1.send(
                JSON.stringify({
                    action: 8,
                })
            );
        };

        ws1.onmessage = (e) => {
            let response = JSON.parse(e.data);
            let tmp = [];
            let tmp2 = [];
            response.matches.forEach((match) => {
                let obj = {
                    label: String(match.matchId),
                    id: match.matchId,
                };
                tmp.push(obj);
                tmp2.push(match);
            });
            setMatchesID(tmp);
            setMatchesInfo(tmp2);
        };

        return ws1;
    }

    useEffect(() => {
        let ws1 = constructWs1();
        setWs(ws1);

        let ws2 = new WebSocket(url);
        ws2.onopen = () => {
            ws2.send(
                JSON.stringify({
                    action: 9,
                    match: match,
                })
            );
        };
        ws2.onmessage = (event) => {
            const response = JSON.parse(event.data);
            setData(response);
            setLoading(false);

            console.log(response);
        };

        setWs2(ws2);

        return () => {
            ws1.close();
            ws2.close();
        };
    }, []);

    const [match, setMatch] = useState(19);

    useEffect(() => {
        const interval = setInterval(() => {
            ws.send(
                JSON.stringify({
                    action: 8,
                })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [ws]);

    useEffect(() => {
        const interval = setInterval(() => {
            ws2.send(
                JSON.stringify({
                    action: 9,
                    match: match,
                })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [match, ws2]);

    useEffect(() => {
        ws?.close();
        setWs(constructWs1());
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

    const selectedInfo = matchesInfo.find((m) => m.matchId === match) ?? {
        state: -1,
        uid1: 0,
        uid2: 0,
    };

    const getState = (value) => {
        if (value === 0) return "Waiting for players";
        if (value === 1) return "Started";
        if (value === 2) return "Finished";
        return "Unknown";
    };

    let symbolForP1 = faXmark;
    let classForP1 = "item flex-1 box player-1";
    let symbolForP2 = faO;
    let classForP2 = "item flex-1 box player-2";

    if (data?.first === selectedInfo.uid2) {
        symbolForP2 = faXmark;
        classForP2 = "item flex-1 box player-1";
        symbolForP1 = faO;
        classForP1 = "item flex-1 box player-2";
    }

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

                <div>
                    <div className="info-row">
                        <div className="item flex-1">State: </div>
                        <div className="item flex-2">
                            {getState(selectedInfo.state)}
                        </div>
                        <div className="item box flex-1"></div>
                    </div>
                    <div className="info-row">
                        <div className="item flex-1">Uid1:</div>
                        <div className="item flex-2">{selectedInfo.uid1}</div>
                        <div className={classForP1}>
                            <div className="value-container">
                                <FontAwesomeIcon icon={symbolForP1} />
                            </div>
                        </div>
                    </div>
                    <div className="info-row">
                        <div className="item flex-1">Uid2:</div>
                        <div className="item flex-2">{selectedInfo.uid2}</div>
                        <div className={classForP2}>
                            <div className="value-container">
                                <FontAwesomeIcon icon={symbolForP2} />
                            </div>
                        </div>
                    </div>
                    <div className="info-row">
                        <div className="item flex-1">First move: </div>
                        <div className="item flex-2">{data?.first}</div>
                        <div className="item box flex-1"></div>
                    </div>
                    <div className="info-row">
                        <div className="item flex-1">Winner: </div>
                        <div className="item flex-2">{data?.winner}</div>
                        <div className="item box flex-1"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
