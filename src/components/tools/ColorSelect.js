import React from "react";

const ColorSelect = ({ colors, selectedItemColor, setSelectedItemColor, setSelectedSize }) => {
    return (
        <div className="order-form-selector mb-3">
            <label className="text-secondary my-2" htmlFor="color-options">
                Color: {selectedItemColor.name ? selectedItemColor.name[0].toUpperCase() + selectedItemColor.name.slice(1): null}
            </label>
            <div id="color-options" className="d-flex">
                {
                    colors.map(color => (
                        <div
                            className={`order-form-option color ${color.name} ${selectedItemColor.id === color.id ? "selected" : ""}`}
                            key={color.id}
                            onClick={() => {
                                setSelectedItemColor(color);
                                setSelectedSize({});
                            }}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default ColorSelect;