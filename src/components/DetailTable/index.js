/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import './style/index.less';

class DetailTable extends React.Component {
  static propTypes = {
    dataSource: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.oneOfType([
          PropTypes.element,
          PropTypes.string,
          PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.element, PropTypes.string])),
        ]),
        value: PropTypes.oneOfType([
          PropTypes.element,
          PropTypes.string,
          PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.element, PropTypes.string])),
        ]),
        colSpan: PropTypes.number,
        isSkipped: PropTypes.bool,
        isKeeped: PropTypes.bool,
      })
    ),
    columnCount: PropTypes.number,
    tableClassName: PropTypes.string,
    labelCellClassName: PropTypes.string,
    valueCellClassName: PropTypes.string,
    emptyCellClassName: PropTypes.string,
  };

  static defaultProps = {
    dataSource: [],
    columnCount: 6,
    tableClassName: 'kb-detail-table',
    labelCellClassName: 'kb-detail-table-label',
    valueCellClassName: 'kb-detail-table-value',
    emptyCellClassName: 'kb-detail-table-empty',
  };

  renderEmptyCell = (idx, colSpan) => (
    <td key={`empty_cell-${idx}`} className={this.props.emptyCellClassName} colSpan={colSpan} />
  );

  renderCellPair = ({ label, value, colSpan = 1 }, idx) => [
    <td key={`cell_label-${idx}`} className={this.props.labelCellClassName}>
      {label}
    </td>,
    <td key={`cell_value-${idx}`} className={this.props.valueCellClassName} colSpan={colSpan}>
      {value}
    </td>,
  ];

  render() {
    const { dataSource, columnCount, tableClassName } = this.props;
    // console.log('我是数据', dataSource);
    const rows = [];
    let rowIdx = 0;
    let row = [];
    let colSpanCount = 0;
    for (let idx = 0; idx < dataSource.length; idx++) {
      const cellData = dataSource[idx];
      if (!cellData.isSkipped || cellData.isKeeped) {
        const cellPair = this.renderCellPair(cellData, idx);
        const { colSpan = 1 } = cellData;
        // 如果当前行已经放不下新单元格
        if (colSpan + colSpanCount + 1 > columnCount) {
          // 先用空单元格补齐当前行
          if (columnCount > colSpanCount) {
            row.push(this.renderEmptyCell(rowIdx, columnCount - colSpanCount));
          }
          // 输出当前行
          rows.push(<tr key={`row-${rowIdx++}`}>{row}</tr>);
          // 再另起一行，将新单元格放入新行
          row = [].concat(cellPair);
          colSpanCount = colSpan + 1;
        } else {
          row = row.concat(cellPair);
          colSpanCount = colSpanCount + colSpan + 1;
        }
      }
    }
    // 如有必要，用空单元格补齐最后一行
    if (columnCount > colSpanCount) {
      row.push(this.renderEmptyCell(rowIdx, columnCount - colSpanCount));
    }
    // 输出最后一行
    rows.push(<tr key={`row-${rowIdx++}`}>{row}</tr>);

    return (
      <table className={tableClassName}>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

export default DetailTable;
