import React from 'react';
import Input from '../../../components/UI/Input';
import Modal from '../../../components/UI/Modal';
import { Container, Row, Col, Button } from 'react-bootstrap';

const AddCategoryModal = (props) => {

  const {
    show,
    handleClose,
    modalTitle,
    categoryName,
    setCategoryName,
    parentCategoryId,
    setParentCategoryId,
    categoryList,
    handleCategoryImage,
    onSubmit
  } = props;

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      onSubmit={onSubmit}
      modalTitle={modalTitle}
    >
      <Row>
        <Col>
          <Input
            value={categoryName}
            placeholder={'Category Name'}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </Col>
        <Col>
          <select className="form-control"
            value={parentCategoryId}
            onChange={(e) => setParentCategoryId(e.target.value)}>
            <option>Select Category</option>
            {
              categoryList.map(option => <option value={option.value} key={option.value}>{option.name}</option>)
            }
          </select>
        </Col>
      </Row>
      {/* <Row>
        <Col>
          <input type="file" name="categoryImage" onChange={handleCategoryImage} style={{ paddingTop: "15px" }} />
        </Col>
      </Row> */}
    </Modal>
  )
}

export default AddCategoryModal;