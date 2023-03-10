import React from "react";
import TileHexagon from "../components/tileHexagon";
import Entity from "../components/entity";
import entity from "../components/entity";

export interface Iqrs {
    q: number;
    r: number;
    s?: number;
}

export interface Ixy {
    x: number;
    y: number;
}

export interface Icoordinate {
    xy?: Ixy;
    qrs?: Iqrs;
}

export interface Ihw {
    h: number;
    w: number;
}

export interface IGameSession {
    key: string;
    name: string;
    timeCreated: number[];
}

export interface IviewBox {
    x: number;
    y: number;
    h: number;
    w: number;
}

export interface IMapData {
    key: string;
    name: string;
    timeCreated: number[];
    mapData: string;
}

export interface IMap {
    key: string;
    name: string;
    height: number;
    radius: number;
    colorMap: Array<Array<string>>;
    loaded: boolean;
}

export interface IContextMenu {
    render: boolean;
    coord: Ixy;
    SVGCoord: Ixy;
    prevMenuButton?: string;
    menuButtonHistory?: string[];
    menuButtons?: string[];
    menuButtonCallback?: Function[];
}

export interface IGameData {
    entityList: IEntity[];
    mapData: IMap;
}

export interface IEntities {
    entityList?: IEntity[];
    reactEntityList?: React.ReactElement[];
}

export interface IState {
    sizeTile: number;
    paintColor: string;
    signedIn: boolean;
    selectedSession: string | undefined;

    mapData: IMap;
    entities: IEntities;
    selectedEntity?: Entity;

    contextMenu: IContextMenu;
}

export interface IPropsBoard {
    mapData: IMap;
    entities?: React.ReactElement[];
    sizeTile: number;
    getMap?: Function;
    saveMap?: Function;

    onTileMouseDown?: Function;
    onTileMouseUp?: Function;
    onTileMouseEnter?: Function;
    onTileMouseClick?: Function;

    onEntityMouseUp?: Function;
    onEntityMouseDown?: Function;
    onEntityMouseMove?: Function;
    onEntityMouseLeave?: Function;
    onEntityMouseEnter?: Function;
    onEntityMouseClick?: Function;

    onMapKeyDown?: Function;
}

export interface IStateBoard {
    viewBox: IviewBox;
}

export interface IEntity {
    id?: number;
    uid?: string; // ID of owner
    sid?: string; // key
    type?: string;

    name?: string;
    level?: number;
    experience?: number;
    hp?: number;
    ac?: number;
    initiative?: number;
    PB?: number;

    color?: string;
    stepSize?: number;
    size?: number | string;
    token?: string;

    xy?: Ixy;
    qrs?: Iqrs;
}

export interface IPropsEntity {
    id?: number;
    uid?: string; // ID of owner
    sid?: string; // key
    type?: string;

    name?: string;
    level?: number;
    experience?: number;
    hp?: number;
    ac?: number;
    initiative?: number;
    PB?: number;

    color?: string;
    stepSize?: number;
    size?: number | string;
    token?: string;

    qrs?: Iqrs;
    xy?: Ixy;

    onMouseUp?: Function;
    onMouseDown?: Function;
    onMouseMove?: Function;
    onMouseLeave?: Function;
    onMouseEnter?: Function;
    onMouseClick?: Function;

    onMove?: Function;
    onChange?: Function;

    onContext?: Function;

    onEntityConstructed?: Function;
}

export interface IStateEntity {
    color: string;
    qrs: Iqrs;
    xy: Ixy;
    size: number;
    token: string;
    id: number;
}

export interface IPropsTileHexagon {
    coords: Iqrs;
    color: string;
    handleOnClick: (e: React.MouseEvent<SVGElement, MouseEvent>, target: TileHexagon) => void;
    handleOnEnter: (e: React.MouseEvent<SVGElement, MouseEvent>, target: TileHexagon) => void;
    handleOnDown: (e: React.MouseEvent<SVGElement, MouseEvent>, target: TileHexagon) => void;
    handleOnUp: (e: React.MouseEvent<SVGElement, MouseEvent>, target: TileHexagon) => void;
}

export interface IPropsPropertiesWindow {
    entity?: Entity;
}

export interface IStatePropertiesWindow extends IEntity {

}

export interface IStateTileHexagon {
    color: string;
}