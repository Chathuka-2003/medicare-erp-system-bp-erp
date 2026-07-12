package com.healthcare.backend.laboratory.converter;

import com.healthcare.backend.laboratory.enums.LabTestCategory;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class LabTestCategoryConverter implements AttributeConverter<LabTestCategory, String> {

    @Override
    public String convertToDatabaseColumn(LabTestCategory category) {
        if (category == null) {
            return null;
        }
        return category.name();
    }

    @Override
    public LabTestCategory convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return null;
        }
        try {
            return LabTestCategory.valueOf(dbData.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return LabTestCategory.OTHERS;
        }
    }
}
