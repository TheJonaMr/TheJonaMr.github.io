import * as React from 'react';

import {ThemeContext, themes, PaintingContext, painting} from '../tools/contexts';

import {Iqrs, Ixy, IPropsEntity, IStateEntity, IviewBox} from "../interfaces/dndem";

import DndemEntity from "../styles/board.module.css";

import {getSVGCoord} from "../tools/tools";
import Tile from "./tileHexagon";

class Entity extends React.Component<IPropsEntity, IStateEntity> {
    static pid = 1;
    static eid = 1;
    static npcid = 1;


    constructor(props: IPropsEntity) {
        super(props);

        this.handleOnClick = this.handleOnClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleExit = this.handleExit.bind(this);

        this.handleOnMouseUp = this.handleOnMouseUp.bind(this);
        this.handleOnMouseDown = this.handleOnMouseDown.bind(this);
        this.handleOnMouseMove = this.handleOnMouseMove.bind(this);
        this.handleOnMouseLeave = this.handleOnMouseLeave.bind(this);
        this.handleOnMouseEnter = this.handleOnMouseEnter.bind(this);
        this.handleOnMouseClick = this.handleOnMouseClick.bind(this);
        this.handleOnMove = this.handleOnMove.bind(this);

        this.handleOnContextMenu = this.handleOnContextMenu.bind(this);


        this.type = this.props.type;


        // TODO: Re-use IDs. If there are 5 players with IDs from 1 to 5, and player 3 is deleted, the next ID should be 3.
        if (this.props.id !== undefined) {
            this._id = this.props.id;

            // I hope this prevents the counter from going higher than it should.
            if (this.type == "player") Entity.pid = this._id + 1;
            else if (this.type == "enemy") Entity.eid = this._id + 1;
            else if (this.type == "npc") Entity.npcid = this._id + 1;

        }
        else if (this.type == "player") this._id = Entity.pid++;
        else if (this.type == "enemy") this._id = Entity.eid++;
        else if (this.type == "npc") this._id = Entity.npcid++;

        this.name = this.type + " " + this.id;

        if (this.props.color !== undefined) {
            this._color = this.props.color;
        }
        else {
            this._color = 'Aquamarine';
        }

        if (this.props.stepSize !== undefined) {
            this._stepSize = this.props.stepSize;
        }
        else {
            this._stepSize = 8;
        }

        if (typeof this.props.size == 'string') {
            if      (this.props.size == 'small')       this._size = this._stepSize*0.375;
            else if (this.props.size == 'medium')      this._size = this._stepSize*0.75;
            else if (this.props.size == 'large')       this._size = this._stepSize;
            else if (this.props.size == 'huge')        this._size = this._stepSize*2;
            else if (this.props.size == 'gargantuan')  this._size = this._stepSize*3;
            else if (this.props.size == 'colossal')    this._size = this._stepSize*4; // 30 before, now 32
            else                                       this._size = this._stepSize;
            this._size = Math.round(this._size);
        }
        else if (typeof this.props.size == 'number') {
            this._size = this.props.size;
        }
        else {
            this._size = 6;
        }

        if (this.props.qrs !== undefined) {
            this._qrs = {q: this.props.qrs.q, r: this.props.qrs.r, s: -this.props.qrs.q - this.props.qrs.r};
            this._xy = this.qrsToXy(this.props.qrs);
        }
        else if (this.props.xy !== undefined) {
            this._xy = this.props.xy;
            this._qrs = this.xyToQrs(this.props.xy);
        }
        else {
            this._qrs = {q: 0, r: 0, s: 0};
            this._xy = {x: 0, y: 0};
        }

        this._token = this.props.token;

        this.state = {
            color: this._color,
            qrs: this._qrs,
            xy: this._xy,
            size: this._size,
            token: this._token,
            id: this._id
        };

        console.log("Entity Constructor", this.id);
        if (this.props.onEntityConstructed !== undefined) this.props.onEntityConstructed(this);
    }

    private _id: number;
    get id(): number {
        return this._id;
    }
    set id(value: number) {
        console.log('helluy');
        this._id = value;
        this.setState({id: this.id});
    }

    private _size: number;
    get size(): number {
        return this._size;
    }
    set size(value: number) {
        this._size = value;
        this.setState({size: this.size});
    }

    private _type: string;
    get type(): string {
        return this._type;
    }
    set type(value: string) {
        this._type = value;
    }

    private _name: string;
    get name(): string {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
    }

    private _stepSize: number;
    get stepSize(): number {
        return this._stepSize;
    }
    set stepSize(value: number) {
        this._stepSize = value;
    }

    private _qrs: Iqrs;
    get qrs(): Iqrs {
        return this._qrs;
    }
    set qrs(value: Iqrs) {
        this._qrs = value;
    }

    private _xy: Ixy;
    get xy(): Ixy {
        return this._xy;
    }
    set xy(value: Ixy) {
        this._xy = value;
    }

    private _color: string;
    get color(): string {
        return this._color;
    }
    set color(value: string) {
        // console.log(value);
        if (this._color === value) return;
        this._color = value;
        this.setState({color: value})
    }

    private _token: string;
    get token(): string {
        return this._token;
    }
    set token(value: string) {
        this._token = value;
        this.setState({token: value})
    }

    qrsToXy(qrs: Iqrs) {
        let xy: Ixy = {x: 0, y: 0};
        xy.x = this.stepSize * (Math.sqrt(3) * qrs.q  +  Math.sqrt(3)/2 * qrs.r)
        xy.y = this.stepSize * (                                         3./2 * qrs.r)
        return xy;
    }

    xyToQrs(xy: Ixy) {
        let qrs: Iqrs = {q: 0, r: 0, s: 0};
        qrs.q = (Math.sqrt(3)/3 * xy.x  -  1./3 * xy.y) / this.stepSize
        qrs.r = (                             2./3 * xy.y) / this.stepSize
        qrs.s = -qrs.q - qrs.r
        return qrs;
    }

    // TODO: Add support for delta s
    move(deltaQrs: Iqrs) { // Ixy | Iqrs
        /*if (typeof coord.q !== undefined) {

        }
        else if (typeof coord === 'Ixy') {

        }*/

        // Math.sqrt(3) * this.stepSize

        let newQrs: Iqrs = {q: this.state.qrs.q + deltaQrs.q,
            r: this.state.qrs.r + deltaQrs.r,
            s: 0};

        if ((typeof newQrs.s !== 'undefined') && (typeof this.state.qrs.s !== 'undefined'))
            newQrs.s = this.state.qrs.s - deltaQrs.q - deltaQrs.r;

        let newXy: Ixy = this.qrsToXy(newQrs);

        this.xy = newXy;
        this.qrs = newQrs;
        this.setState({xy: newXy, qrs: newQrs}); // check out call back for setState
        //this.handleOnMove();
    }

    handleOnContextMenu(e: React.MouseEvent<SVGElement>) {
        if (this.props.onContext !== undefined) this.props.onContext(e, this);
    }

    handleOnClick(e: React.MouseEvent<SVGElement>) {

    }

    handleOnMove() {
        if (this.props.onMove !== undefined) this.props.onMove(null, this);
    }

    handleOnChange() {
        if (this.props.onChange !== undefined) this.props.onChange(this);
    }

    onKeyDown(e: React.KeyboardEvent<SVGElement>) {
        let deltaQrs: Iqrs = {q: 0, r: 0};
        let xy: Ixy = {x: 0, y: 0};
        let key: string = e.key.toLowerCase();
        //console.log(e.key);

        if (key === 'arrowleft' || key === 'a')         deltaQrs = {q: -1, r: 0};
        else if (key === 'arrowright' || key === 'd')   deltaQrs = {q: 1, r: 0};
        else if (key === 'arrowup' || key === 'e')      deltaQrs = {q: 1, r: -1};
        else if (key === 'arrowdown' || key === 'z')    deltaQrs = {q: -1, r: 1};
        else if (key === 'w')                           deltaQrs = {q: 0, r: -1};
        else if (key === 'x')                           deltaQrs = {q: 0, r: 1};
        else if (key === 's') {                         // Centering entity to the tile with the closest center.

            let remQ: number = this.qrs.q % 1; // remainder
            let remR: number = this.qrs.r % 1; // remainder

            //let remAbsQ: number = Math.abs(remQ); // Absolute remainder
            //let remAbsR: number = Math.abs(remR); // Absolute remainder

            if (remQ >= 0.5) deltaQrs.q = 1 - (this.qrs.q % 1);
            else if (0.5 > remQ && remQ > -0.5) deltaQrs.q = -(this.qrs.q % 1);
            else if (remQ <= -0.5) deltaQrs.q = -((this.qrs.q % 1) + 1);
            else deltaQrs.q = - (this.qrs.q % 1);

            if (remR >= 0.5) deltaQrs.r = 1 - (this.qrs.r % 1);
            else if (0.5 > remR && remR > -0.5) deltaQrs.r = -(this.qrs.r % 1);
            else if (remR <= -0.5) deltaQrs.r = -((this.qrs.r % 1) + 1);
            else deltaQrs.r = - (this.qrs.r % 1);
        }

        if (deltaQrs.q !== 0 || deltaQrs.r !== 0) {
            this.move(deltaQrs);
        }
    }

    handleExit(e: React.MouseEvent<SVGElement>) {

    }

    handleSelect(e: React.MouseEvent<SVGElement>) {

    }

    handleMove(e: React.MouseEvent<SVGElement>) {

    }

    handleOnMouseUp(e: React.MouseEvent<SVGElement>) {
        if (this.props.onMouseUp !== undefined) this.props.onMouseUp(e, this);
    }

    handleOnMouseDown(e: React.MouseEvent<SVGElement>) {
        if (this.props.onMouseDown !== undefined) this.props.onMouseDown(e, this);
    }

    handleOnMouseMove(e: React.MouseEvent<SVGElement>) {
        if (this.props.onMouseMove !== undefined) this.props.onMouseMove(e, this);
    }

    handleOnMouseLeave(e: React.MouseEvent<SVGElement>) {
        if (this.props.onMouseLeave !== undefined) this.props.onMouseLeave(e, this);
    }

    handleOnMouseEnter(e: React.MouseEvent<SVGElement>) {
        if (this.props.onMouseEnter !== undefined) this.props.onMouseEnter(e, this);
    }

    handleOnMouseClick(e: React.MouseEvent<SVGElement>) {
        if (this.props.onMouseClick !== undefined) this.props.onMouseClick(e, this);
    }

    componentDidUpdate(prevProps: Readonly<IPropsEntity>, prevState: Readonly<IStateEntity>, snapshot?: any) {
        this.handleOnChange();
        return true;
    }

    render() {
        //console.log("RENDER ENTITY", this.state.xy);

        //let className: string = 'entity';

        let fontSize: string = this.size/10 + "em";

        //let qrs: Iqrs = this.state.qrs;
        let xy: Ixy = this.state.xy;

        return (
            <g className={DndemEntity.entity}

               onMouseUp={this.handleOnMouseUp}
               onMouseDown={this.handleOnMouseDown}
               onMouseMove={this.handleOnMouseMove}
               onMouseLeave={this.handleOnMouseLeave}
               onMouseEnter={this.handleOnMouseEnter}
               onClick={this.handleOnMouseClick}
               onContextMenu={this.handleOnContextMenu}

               onKeyDown={this.onKeyDown}
               tabIndex={-1}>
                <defs>
                    <clipPath id={"entityClipPath" + this.props.sid}>
                        <circle cx={xy.x} cy={xy.y} r={this.state.size}></circle>
                    </clipPath>
                </defs>
                <circle className={DndemEntity.entity} id={this.props.sid.toString()} cx={xy.x} cy={xy.y} r={this.state.size} fill={this.state.color}/>
                <text className={DndemEntity.entity}
                      fontSize={fontSize}
                      x={xy.x}
                      y={xy.y}>{this.state.id}</text>
                <image width={this.state.size*2} height={this.state.size*2}
                       x={xy.x - this.state.size} y={xy.y - this.state.size}
                       clipPath={"url(#entityClipPath" +  this.props.sid + ")"}
                       className={DndemEntity.entity}
                       href={this.state.token}>

                </image>
            </g>

        );
    }
}

export default Entity;