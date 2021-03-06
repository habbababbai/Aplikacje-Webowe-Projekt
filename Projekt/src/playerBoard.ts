import { colors } from './colors';
import { Board } from './board';
import { CellState } from './cellState';
import * as consts from './consts';

export class PlayerBoard extends Board{
    
    placingHorizontal: boolean;
    is5Placed: boolean;
    is4Placed: boolean;
    is3Placed: boolean;
    is2Placed: boolean;
    shipsPlaced: boolean[];

    constructor (buttons: HTMLElement[]){
        super(buttons);
        this.placingHorizontal = true;
        this.is5Placed = false;
        this.is4Placed = false;
        this.is3Placed = false;
        this.is2Placed = false;
        this.shipsPlaced = [this.is2Placed, this.is3Placed, this.is4Placed, this.is5Placed];
    }
    getEmptyCells (){
        let emptyCells: number[] = [];
        for (let i = 0; i < this.cellTable.length; i++){
            if (i % 2 == 0){
                if (this.cellTable[i].state == CellState.Empty || this.cellTable[i].state == CellState.Ship){
                    emptyCells.push(i);
                }
            }
        }
        return emptyCells;
    }
    getHitCells () {
        let hitCells = [];
        for (let i = 0; i < this.cellTable.length; i++){
            if(this.cellTable[i].state == CellState.Hit){
                hitCells.push(i);
            }
        }
        return hitCells;
    }
    getHitNeighbours(){
        let hitCells = this.getHitCells();
        let hitNeigbhours: number[] = [];
        for (let i = 0; i < hitCells.length; i++){
            hitNeigbhours = hitNeigbhours.concat(this.getNeighbours(hitCells[i]));
        }
        hitNeigbhours = hitNeigbhours.filter(i => this.cellTable[i].state != CellState.Miss && this.cellTable[i].state != CellState.Hit);
        return hitNeigbhours;
    }
    getNeighbours(index:number) {
        let neigbours:number[] = [];
        if (index > consts.FIRST_ROW_LAST_INDEX){
            neigbours.push(index - consts.DIMENSION_LENGTH);
        }
        if (index < consts.LAST_ROW_FIRST_INDEX){
            neigbours.push(index + consts.DIMENSION_LENGTH);
        }
        if (index % consts.DIMENSION_LENGTH != 0){
            neigbours.push(index - 1);
        }
        if ((index - consts.FIRST_ROW_LAST_INDEX) % consts.DIMENSION_LENGTH != 0 ){
            neigbours.push(index + 1);
        }
        return neigbours;
    }
    setShip(index:number, length:number){
        let isPlaced = false;
        if (this.placingHorizontal){
            if(this.canPlaceHorizontal(index, length)){
                this.placeHorizontal(index, length);
                isPlaced  = true;                
            }
        }
        else {
            if (this.canPlaceVertical(index, length)){
                this.placeVertical(index, length);
                isPlaced = true;
            }
        }

        if (isPlaced){
            switch(length) {
                case 2:
                    this.is2Placed = true;
                    break;
                case 3:
                    this.is3Placed = true;
                    break;
                case 4: 
                    this.is4Placed = true;
                    break;
                case 5:
                    this.is5Placed = true
                    break;
            }
            this.resetButtonEvents();
        }
    }
    setBoardRandomly() {
        this.placeRandomly(5);
        this.placeRandomly(4);
        this.placeRandomly(3);
        this.placeRandomly(2);
        this.is5Placed = true;
        this.is4Placed = true;
        this.is3Placed = true;
        this.is2Placed = true;
    }
    areShipsPlaced() {
        if (this.is5Placed && this.is4Placed && this.is3Placed && this.is2Placed){
            return true;
        }
        return false;
    }
    anyShipPlaced(){
        if (this.is5Placed || this.is4Placed || this.is3Placed || this.is2Placed){
            return true;
        }
        return false;
    }
    resetButtonEvents() {
        for (let i = 0; i < this.cellTable.length; i++){
            this.cellTable[i].button.onclick = function() {}; 
            this.cellTable[i].button.onmouseover = function() {}; 
            this.cellTable[i].button.onmouseout = function() {}; 
        }
    }
    placeHorizontal(index:number, length:number){
        for (let i = index; i < index+ length; i++){
            this.cellTable[i].button.style.backgroundColor = colors.ship;
            this.cellTable[i].state = CellState.Ship;
            
        }
    }
    placeVertical(index:number, length:number){
        for (let i = index; i < index + (length) * consts.DIMENSION_LENGTH; i = i + consts.DIMENSION_LENGTH){
            this.cellTable[i].button.style.backgroundColor = colors.ship;
            this.cellTable[i].state = CellState.Ship;
        }
    }
    chooseShip(length:number) {
        if (!this.shipsPlaced[length - 2]){
            for(let i = 0; i < this.cellTable.length; i++){
                this.cellTable[i].button.onclick = () => {this.setShip(i, length)};
                this.cellTable[i].button.onmouseover = () => {this.hover(i, length, colors.hover)};
                this.cellTable[i].button.onmouseout = () => {this.hover(i, length, colors.empty)};
            }
        }
        
    }

    hover(index:number, length:number, colour:string){
        if(this.placingHorizontal){
            if(this.canPlaceHorizontal(index, length)){
                
                for (let i = index; i < index + length; i++){
                    this.cellTable[i].button.style.backgroundColor = colour;
                }
                
                
            }
        }
        else {
            if (this.canPlaceVertical(index, length)){
                for (let i = index; i < index + (length * consts.DIMENSION_LENGTH); i = i + consts.DIMENSION_LENGTH){
                    this.cellTable[i].button.style.backgroundColor = colour;
                }
            }
        }
    }
    
    
}