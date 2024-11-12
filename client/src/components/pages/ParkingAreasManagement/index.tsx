import React, { useEffect, useState } from 'react';
import './index.scss';
import {
  addParkingArea,
  deleteParkingArea,
  editParkingArea,
  getParkingAreas,
} from '../../../services';
import Loader from '../../modules/Loader';
import { ReactComponent as DeleteIcon } from '../../../assets/icons/delete.svg';
import { ReactComponent as EditIcon } from '../../../assets/icons/edit.svg';
import { NewParkingArea, ParkingArea } from '../../../types';

const ParkingAreasManagement = () => {
  const [formData, setFormData] = useState<NewParkingArea>({
    name: '',
    rate1: null,
    rate2: null,
    discount: null,
  });

  const [areas, setAreas] = useState<ParkingArea[]>([]);
  const [isAddPannelActive, setAddPannelActive] = useState<boolean>(false);
  const [isDeletePannelActive, setDeletePannelActive] =
    useState<boolean>(false);
  const [isEditPannelActive, setEditPannelActive] = useState<boolean>(false);
  const [proceedAreaId, setProceedAreaId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isFormValid =
    formData.name &&
    formData.rate1 &&
    formData.rate2 &&
    (formData.discount || formData.discount === 0);
  useEffect(() => {
    loadAreas();
  }, []);

  const handleAddArea = () => {
    const { name, rate1, rate2, discount } = formData;
    if (name && rate1 && rate2 && (discount || discount === 0)) {
      setIsLoading(true);
      addParkingArea({ name, rate1, rate2, discount })
        .then(() => {
          setIsLoading(false);
          loadAreas();
          closePannel();
        })
        .catch(() => {
          setIsLoading(false);
          alert('Failed to add area');
        });
    }
  };
  const handleEditArea = () => {
    const { name, rate1, rate2, discount } = formData;
    
    if (name && rate1 && rate2 && (discount || discount === 0)) {
      setIsLoading(true);
      editParkingArea({ id: proceedAreaId, name, rate1, rate2, discount })
        .then(() => {
          const updatedAreas = areas.map((area) =>
            area.id === proceedAreaId
              ? { ...area, name, rate1, rate2, discount }
              : area
          );
          setIsLoading(false);
          setAreas(updatedAreas);
          closePannel();
        })
        .catch(() => {
          setIsLoading(false);
          alert('Failed to edit area');
        });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    isAddPannelActive ? handleAddArea() : handleEditArea();
  };

  const loadAreas = () => {
    setIsLoading(true);
    getParkingAreas()
      .then((res) => {
        setAreas(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        alert('Failed to load area. '+ err.response.data.name);
      });
  };

  const editArea = (id: string) => {
    setProceedAreaId(id);
    setEditPannelActive(true);
    const areaToEdit = areas.find((area) => area.id === id);
    if (areaToEdit) {
      setFormData({
        name: areaToEdit.name,
        rate1: areaToEdit.rate1,
        rate2: areaToEdit.rate2,
        discount: areaToEdit.discount,
      });
    }
  };

  const closePannel = () => {
    setAddPannelActive(false);
    setEditPannelActive(false);
    setFormData({ name: '', rate1: null, rate2: null, discount: null });
  };

  const handleDeleteArea = () => {
    setIsLoading(true);
    deleteParkingArea(proceedAreaId)
      .then((res) => {
        const updatedAreas = areas.filter((area) => area.id !== proceedAreaId);
        setIsLoading(false);
        setAreas(updatedAreas);
        setDeletePannelActive(false);
      })
      .catch(() => {
        setIsLoading(false);
        alert('Failed to delete area');
      });
  };

  const deleteArea = (id: string) => {
    setProceedAreaId(id);
    setDeletePannelActive(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | number | null = value;
    if (type === 'number') {
      newValue = value === '' ? null : Number(value);
    }
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const renderForm = () => (
    <form
      className="form"
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
    >
      <p className="form__title">
        {isAddPannelActive ? 'Add new area' : 'Edit Area'}
      </p>

      <div className="form__input-container">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form__input-container">
        <label>Rate 1($):</label>
        <input
          type="number"
          min={1}
          name="rate1"
          value={formData.rate1 || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form__input-container">
        <label>Rate 2($):</label>
        <input
          type="number"
          min={1}
          name="rate2"
          value={formData.rate2 || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form__input-container">
        <label>Discount:</label>
        <input
          type="number"
          min={0}
          max={100}
          name="discount"
          value={formData.discount !== null ? formData.discount : ''}
          onChange={handleInputChange}
        />
      </div>

      <button className={isFormValid ? '' : 'disabled'} type="submit">
        {isAddPannelActive ? 'Add' : 'Update'}
      </button>
    </form>
  );

  return (
    <div className="parking-areas-management">
      {isLoading && <Loader />}
      {(isAddPannelActive || isEditPannelActive) && (
        <div
          className="parking-areas-management__add-container"
          onClick={closePannel}
        >
          {renderForm()}
        </div>
      )}
      {isDeletePannelActive && (
        <div
          className="parking-areas-management__confirm-delete-container"
          onClick={() => setDeletePannelActive(false)}
        >
          <div
            className="parking-areas-management__confirm-delete"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="confirm-delete__text">Are you sure?</p>
            <div className="confirm-delete__buttons">
              <button
                className="confirm-delete__buttons--delete"
                onClick={handleDeleteArea}
              >
                Delete
              </button>
              <button
                className="confirm-delete__buttons--cancel"
                onClick={() => setDeletePannelActive(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setAddPannelActive(true)}
        className="parking-areas-management__add-button"
      >
        Add new parking area
      </button>
      <div className="parking-areas-management__areas">
        {areas.map((area, key) => (
          <div key={key} className="areas__tile">
            <div key={key} className="areas__tile-content">
              <div className="areas__tile-text-container">
                <p>Name:</p>
                <span>{area.name}</span>
              </div>
              <div className="areas__tile-text-container">
                <p>Weekdays hourly rate:</p>
                <span>{area.rate1}$</span>
              </div>
              <div className="areas__tile-text-container">
                <p>Weekend hourly rate:</p>
                <span>{area.rate2}$</span>
              </div>
              <div className="areas__tile-text-container">
                <p>Discount:</p>
                <span>{area.discount}%</span>
              </div>
            </div>
            <div className="areas__tile-actions">
              <EditIcon
                className="areas__tile-icon"
                onClick={() => area.id && editArea(area.id)}
              />

              <DeleteIcon
                className="areas__tile-icon"
                onClick={() => area.id && deleteArea(area.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingAreasManagement;
