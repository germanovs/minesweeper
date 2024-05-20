import { useState, useEffect } from 'react'
import './App.scss'

function App() {

	const [minesCount, setMinesCount] = useState<number>(10);
	const [gameMap, setGameMap] = useState<boolean[]>([]);
	const [grid, setGrid] = useState<boolean[][]>([]);
	const [displayGrid, setDisplayGrid] = useState<cellState[][]>([]);

	const createNewGame = () => {
		const newGameMap = new Array(100).fill(false);
		let minesLocations: number[] = [];
		while (minesLocations.length < minesCount) {
			const randomIndex = Math.floor(Math.random() * 100);
			if (!minesLocations.includes(randomIndex)) {
				minesLocations.push(randomIndex);
			}
		}

		minesLocations.forEach((mineLocation) => {
			newGameMap[mineLocation] = true;
		});
		setGameMap(newGameMap);

		const grid = [];
		for (let i = 0; i < 10; i++) {
			grid.push(gameMap.slice(i * 10, i * 10 + 10));
		}
		setGrid(grid);

		const displayGrid = new Array(10).fill(new Array(10).fill('closed'));
		setDisplayGrid(displayGrid);
	}

	const countMinesAround = (row: number, col: number, grid: boolean[][]) => {
		const map = [
			grid[row - 1] === undefined || grid[row - 1][col - 1] === undefined ? false : grid[row - 1][col - 1],
			grid[row - 1] === undefined ? false : grid[row - 1][col],
			grid[row - 1] === undefined || grid[row - 1][col + 1] === undefined ? false : grid[row - 1][col + 1],
			grid[row][col - 1] === undefined ? false : grid[row][col - 1],
			grid[row][col + 1] === undefined ? false : grid[row][col + 1],
			grid[row + 1] === undefined || grid[row + 1][col - 1] === undefined ? false : grid[row + 1][col - 1],
			grid[row + 1] === undefined ? false : grid[row + 1][col],
			grid[row + 1] === undefined || grid[row + 1][col + 1] === undefined ? false : grid[row + 1][col + 1],
		];
		return map.filter(elem => elem).length;
	}

	const defineCellNumber = (rowIndex: number, cellIndex: number, displayGrid: cellState[][]) => {
		const minesCount = countMinesAround(rowIndex, cellIndex, grid);
		console.log(rowIndex, cellIndex);
		displayGrid[rowIndex][cellIndex] = minesCount;

		if (minesCount === 0) {
			// top-left
			if (rowIndex > 0 && cellIndex > 0 && displayGrid[rowIndex - 1][cellIndex - 1] === 'closed' && displayGrid[rowIndex - 1][cellIndex - 1] === 'closed') {
				defineCellNumber(rowIndex - 1, cellIndex - 1, displayGrid);
			}
			// top
			if (rowIndex > 0 && displayGrid[rowIndex - 1][cellIndex] === 'closed') {
				defineCellNumber(rowIndex - 1, cellIndex, displayGrid);
			}
			// top-right
			if (rowIndex > 0 && cellIndex < 9 && displayGrid[rowIndex - 1][cellIndex + 1] === 'closed' && displayGrid[rowIndex - 1][cellIndex + 1] === 'closed') {
				defineCellNumber(rowIndex - 1, cellIndex + 1, displayGrid);
			}
			// bottom-left
			if (rowIndex < 9 && cellIndex > 0 && displayGrid[rowIndex + 1][cellIndex - 1] === 'closed' && displayGrid[rowIndex + 1][cellIndex - 1] === 'closed') {
				defineCellNumber(rowIndex + 1, cellIndex - 1, displayGrid);
			}
			// bottom
			if (rowIndex < 9 && displayGrid[rowIndex + 1][cellIndex] === 'closed') {
				defineCellNumber(rowIndex + 1, cellIndex, displayGrid);
			}
			// bottom-right
			if (rowIndex < 9 && cellIndex < 9 && displayGrid[rowIndex + 1][cellIndex + 1] === 'closed' && displayGrid[rowIndex + 1][cellIndex + 1] === 'closed') {
				defineCellNumber(rowIndex + 1, cellIndex + 1, displayGrid);
			}
			// left
			if (cellIndex > 0 && displayGrid[rowIndex][cellIndex - 1] === 'closed') {
				defineCellNumber(rowIndex, cellIndex - 1, displayGrid);
			}
			// right
			if (cellIndex < 9 && displayGrid[rowIndex][cellIndex + 1] === 'closed') {
				defineCellNumber(rowIndex, cellIndex + 1, displayGrid);
			}
		}

		return;
	}

	const openCell = (rowIndex: number, cellIndex: number): void => {
		const cellState = displayGrid[rowIndex][cellIndex];
		if (cellState !== 'closed') {
			return;
		}

		const newDisplayGrid = JSON.parse(JSON.stringify(displayGrid));

		if (grid[rowIndex][cellIndex]) {
			newDisplayGrid[rowIndex][cellIndex] = 'mine';
			setDisplayGrid(newDisplayGrid);
			window.alert('You lost');
			return;
		}

		defineCellNumber(rowIndex, cellIndex, newDisplayGrid);
		setDisplayGrid(newDisplayGrid);
	}

	const markCell = (e: React.SyntheticEvent, row: number, col: number) => {
		e.preventDefault();
		setDisplayGrid(prev => {
			const newDisplayGrid = JSON.parse(JSON.stringify(prev));
			if (newDisplayGrid[row][col] === 'closed') {
				newDisplayGrid[row][col] = 'marked';
			} else if (newDisplayGrid[row][col] === 'marked') {
				newDisplayGrid[row][col] = 'closed';
			}
			return newDisplayGrid;
		})
	}

	useEffect(() => {
		const openedCellsAmount = displayGrid.flat().filter(elem => typeof elem === 'number');
		if (openedCellsAmount.length >= 90) {
			window.alert('You win!');
		}
	}, [displayGrid])

	useEffect(() => {
		createNewGame();
	}, []);

	return (
	<div className='container'>
		<h1>Minesweeper</h1>
		<div className='playfield'>

			<div className='grid'>
				{
					displayGrid.map((row, rowIndex) => {
						return row.map((cell, cellIndex) => {
							return (
								<div 
									key={rowIndex + '-' + cellIndex}
									className='cell'
									style={{ backgroundColor: typeof cell === 'number' ? 'lightgrey' : 'inherit' }}
									onClick={() => openCell(rowIndex, cellIndex)}
									onContextMenu={(e) => markCell(e, rowIndex, cellIndex)}
									>
									{
										cell === 'closed'
											? ''
											: cell === 'mine' 
												? '!'
												: cell === 'marked'
													? 'x'
													: cell === 0
														? ''
														: cell
									}
								</div>
							)
						})
					})
				}
			</div>

			<div>
				<button onClick={() => createNewGame()}>New Game</button>
			</div>
		</div>
	</div>)
}

export default App
