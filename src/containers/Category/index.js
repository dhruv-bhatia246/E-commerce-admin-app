import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, getAllCategory, updateCategories, deleteCategories as deleteCategoriesAction } from '../../actions/category.action';
import Layout from '../../components/layout';
import Modal from '../../components/UI/Modal';
import './style.css';
import CheckboxTree from 'react-checkbox-tree';
import { IoIosCheckboxOutline, IoIosCheckbox, IoMdSquareOutline, IoIosArrowDown, IoIosArrowForward, IoIosAdd, IoIosTrash, IoMdCreate } from 'react-icons/io';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import UpdateCategoriesModal from './components/UpdateCategoriesModal';
import AddCategoryModal from './components/AddCategoryModal';

/**
* @author
* @function Category
**/

const Category = (props) => {

  const category = useSelector(state => state.category);
  const [show, setShow] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState('');
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [checkedArray, setCheckedArray] = useState([]);
  const [expandedArray, setExpandedArray] = useState([]);
  const [updateCategoryModal, setUpdateCategoryModal] = useState(false);
  const [deleteCategoryModal, setDeleteCategoryModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {

    if (!category.loading) {
      setShow(false);
    }

  }, [category.loading])

  const handleClose = () => {

    if (categoryName === "") {
      alert("Category Name is required.");
      setShow(false);
      return;
    }

    const data = {
      name: categoryName,
      parentId: parentCategoryId,
      categoryImage: categoryImage
    }

    dispatch(addCategory(data));
    setCategoryName('');
    setParentCategoryId('');

    setShow(false);

  };
  const handleShow = () => setShow(true);

  const renderCategories = (categories) => {
    let myCategories = [];
    for (let category of categories) {
      myCategories.push(
        {
          label: category.name,
          value: category._id,
          children: category.children.length > 0 && renderCategories(category.children)
        }
      );
    }
    return myCategories;
  }


  const createCategoryList = (categories, options = []) => {

    for (let category of categories) {
      options.push({
        value: category._id,
        name: category.name,
        parentId: category.parentId,
        type: category.type
      })
      if (category.children.length > 0) {
        createCategoryList(category.children, options)
      }
    }
    return options;
  }

  const handleCategoryImage = (e) => {
    setCategoryImage(e.target.files[0]);
  }

  const updateCategory = () => {
    updateCheckedAndExpandedCategories();
    setUpdateCategoryModal(true);

  }

  const updateCheckedAndExpandedCategories = () => {
    const categories = createCategoryList(category.categories);
    const checkedArray = [];
    const expandedArray = [];
    checked.length > 0 && checked.forEach((categoryId, index) => {
      const category = categories.find((category, _index) => categoryId == category.value);
      category && checkedArray.push(category);
    })
    expanded.length > 0 && expanded.forEach((categoryId, index) => {
      const category = categories.find((category, _index) => categoryId == category.value);
      category && expandedArray.push(category);
    })
    setCheckedArray(checkedArray);
    setExpandedArray(expandedArray);
  }

  const handleCategoryInput = (key, value, index, type) => {
    if (type === "checked") {
      const updatedCheckedArray = checkedArray.map((item, _index) => index == _index ?
        { ...item, [key]: value } : item
      );
      setCheckedArray(updatedCheckedArray);
    } else if (type === "expanded") {
      const updatedExpandedArray = expandedArray.map((item, _index) => index == _index ?
        { ...item, [key]: value } : item
      );
      setExpandedArray(updatedExpandedArray);
    }
  }

  const updateCategoriesForm = () => {
    const form = new FormData();

    expandedArray.forEach((item, index) => {
      form.append('_id', item.value);
      form.append('name', item.name);
      form.append('parentId', item.parentId ? item.parentId : "");
      form.append('type', item.type);
    })
    checkedArray.forEach((item, index) => {
      form.append('_id', item.value);
      form.append('name', item.name);
      form.append('parentId', item.parentId ? item.parentId : "");
      form.append('type', item.type);
    })
    dispatch(updateCategories(form));

    setUpdateCategoryModal(false);
  }

  const deleteCategory = () => {
    updateCheckedAndExpandedCategories();
    setDeleteCategoryModal(true);
  }

  const deleteCategories = () => {
    const checkedIdsArray = checkedArray.map((item, index) => ({ _id: item.value }));
    const expandedIdsArray = expandedArray.map((item, index) => ({ _id: item.value }));
    const idsArray = expandedIdsArray.concat(checkedIdsArray);

    if (checkedIdsArray.length > 0) {
      dispatch(deleteCategoriesAction(checkedIdsArray))
        .then(result => {
          if (result) {
            dispatch(getAllCategory());
            setDeleteCategoryModal(false);
          }
        });
    }

    setDeleteCategoryModal(false);

  }

  const renderDeleteCategoryModal = () => {
    return (<Modal
      show={deleteCategoryModal}
      handleClose={() => setDeleteCategoryModal(false)}
      modalTitle="Confirm"
      buttons={[
        {
          label: "Yes",
          color: "success",
          onClick: deleteCategories
        },
        {
          label: "No",
          color: "danger",
          onClick: () => {
            alert("Yes");
          }
        }
      ]}
    >
      <h5>Expanded</h5>
      {expandedArray.map((item, index) => <span key={index}>{item.name}</span>)}
      <h5>Checked</h5>
      {checkedArray.map((item, index) => <span key={index}>{item.name}</span>)}

    </Modal>)
  }

  const categoryList = createCategoryList(category.categories);

  return (
    <Layout sidebar>
      <Container>
        <Row>
          <Col md={12}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>Category</h3>
              <div className="actionBtnContainer">
                <span>Actions:&nbsp;</span>
                <Button variant="outline-dark" className="btn-sm" onClick={handleShow}><IoIosAdd /> <span>Add</span></Button>
                <Button variant="outline-dark" className="btn-sm" onClick={deleteCategory}><IoIosTrash /> <span>Delete</span></Button>
                <Button variant="outline-dark" className="btn-sm" onClick={updateCategory}><IoMdCreate /> <span>Edit</span></Button>
              </div>
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: "20px" }}>
          <Col md={12}>
            {/* <ul>
              {renderCategories(category.categories)}
            </ul> */}
            <CheckboxTree
              nodes={renderCategories(category.categories)}
              checked={checked}
              expanded={expanded}
              onCheck={checked => setChecked(checked)}
              onExpand={expanded => setExpanded(expanded)}
              icons={{
                check: <IoIosCheckbox />,
                uncheck: <IoMdSquareOutline />,
                halfCheck: <IoMdSquareOutline />,
                expandClose: <IoIosArrowForward />,
                expandOpen: <IoIosArrowDown />
              }}
            />
          </Col>
        </Row>
      </Container>
      <AddCategoryModal
        show={show}
        handleClose={() => setShow(false)}
        onSubmit={handleClose}
        modalTitle={'Add New Category'}
        size="lg"
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        parentCategoryId={parentCategoryId}
        setParentCategoryId={setParentCategoryId}
        categoryList={categoryList}
        handleCategoryImage={handleCategoryImage}
      />
      <UpdateCategoriesModal
        show={updateCategoryModal}
        handleClose={() => setUpdateCategoryModal(false)}
        onSubmit={updateCategoriesForm}
        modalTitle={'Update Categories'}
        size="lg"
        expandedArray={expandedArray}
        checkedArray={checkedArray}
        handleCategoryInput={handleCategoryInput}
        categoryList={categoryList}
      />
      {/* {renderAddCategoryModal()} */}
      {renderDeleteCategoryModal()}
    </Layout>
  )
}

export default Category