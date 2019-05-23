import { get } from 'lodash';

export const getProps = (state, props) => props;
export const getSearch = props => props.location.search.substring(1);
export const getPathname = props => props.location.pathname;
export const getParam = (param, props) => props.match.params[param];
export const getBackButtonLink = props => get(props.location.state, 'from', {});
export const getId = props => Number(getParam('id', props));
/**
 * Возвращает fetchStatus указанного listName из state.
 * @param  {string} listName Имя списка из state.lists
 * @return {string}          Статус загрузки списка
 */
export const getListFetchStatus = listName => state => state.lists[listName].fetchStatus;

/**
 * Возвращает объект ключ-значение (сущности из state)
 * @param  {string} type Тип сущности (plural)
 * @return {object}      Объект ключ-значение
 */
export const getEntities = type => state => state.entities[type].entities;

/**
 * Возвращает информацию по типу списку
 * @param  {string} type                        Тип сущности (plural)
 * @return {{ids, fetchStatus, errors, total}}
 */
export const getLists = type => state => state.lists[type];

/**
 * Возвращает информацию по entites определенного типа
 * @param  {string} type                          Тип сущности (plural)
 * @return {{entities, fetchStatus, errors}}      Объект ключ-значение
 */
export const getEntitiesData = entitiesName => state => state.entities[entitiesName];
/**
 * Возвращает информацию по списку определенного типа
 * @param  {string} type                          Тип сущности (plural)
 * @return {{entities, fetchStatus, errors}}      Объект ключ-значение
 */
export const getListData = entitiesName => state => state.lists[entitiesName];
