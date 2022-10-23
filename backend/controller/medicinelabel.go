package controller

import (
	"net/http"

	"github.com/Thanaporn4226/Project-sa-65/entity"
	"github.com/gin-gonic/gin"
)

// ----------------------------------------- using -----------------------------------

// POST /medicine_uses
func CreateMedicineUse(c *gin.Context) {
	var medicineUse entity.MedicineUse
	if err := c.ShouldBindJSON(&medicineUse); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&medicineUse).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": medicineUse})
}

// GET /medicine_uses/:id
func GetMedicineUse(c *gin.Context) {
	var medicineUse entity.MedicineUse
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM medicine_uses WHERE id = ?", id).Scan(&medicineUse).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// if tx := entity.DB().Where("id = ?", id).First(&medicineLabel); tx.RowsAffected == 0 {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "medicine_use not found"})
	// 	return
	// }

	c.JSON(http.StatusOK, gin.H{"data": medicineUse})
}

// GET /medicine_uses
func ListMedicineUse(c *gin.Context) {
	var medicineUse []entity.MedicineUse
	if err := entity.DB().Raw("SELECT * FROM medicine_uses").Scan(&medicineUse).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicineUse})
}

// DELETE medicine_uses/:id
func DeleteMedicineUse(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM medicine_uses WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicine_uses not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /medicine_uses
func UpdateMedicineUse(c *gin.Context) {
	var medicineUse entity.MedicineUse
	if err := c.ShouldBindJSON(&medicineUse); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", medicineUse.ID).First(&medicineUse); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicine_uses not found"})
		return
	}

	if err := entity.DB().Save(&medicineUse).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicineUse})
}

// ----------------------------------------- warning -----------------------------------

// POST /warnings
func CreateWarning(c *gin.Context) {
	var warning entity.Warning
	if err := c.ShouldBindJSON(&warning); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&warning).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": warning})
}

// GET /Warnings/:id
func GetWarning(c *gin.Context) {
	var warning entity.Warning
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM warnings WHERE id = ?", id).Scan(&warning).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// if tx := entity.DB().Where("id = ?", id).First(&warning); tx.RowsAffected == 0 {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "warning not found"})
	// 	return
	// }
	c.JSON(http.StatusOK, gin.H{"data": warning})
}

// GET /warnings
func ListWarning(c *gin.Context) {
	var warning []entity.Warning
	if err := entity.DB().Raw("SELECT * FROM warnings").Scan(&warning).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// if err := entity.DB().Raw("SELECT * FROM warnings").Scan(&warning).Error; err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }

	c.JSON(http.StatusOK, gin.H{"data": warning})
}

// DELETE /warnings/:id
func DeleteWarning(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM warnings WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "warning not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /warnings
func UpdateWarning(c *gin.Context) {
	var warning entity.Warning
	if err := c.ShouldBindJSON(&warning); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", warning.ID).First(&warning); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "warnings not found"})
		return
	}

	if err := entity.DB().Save(&warning).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": warning})
}

//--------------------------------------------- Medicine Label---------------------------------------------------------------------

// POST /medicine_labels
func CreateMedicineLabel(c *gin.Context) {

	var medicineLabel entity.MedicineLabel
	var medicineUse entity.MedicineUse
	var warning entity.Warning
	var employee entity.Employee

	// ผลลัพธ์ที่ได้ จะถูก bind เข้าตัวแปร MedicineLabel
	if err := c.ShouldBindJSON(&medicineLabel); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 9: ค้นหา medicineuse ด้วย id
	if tx := entity.DB().Where("id = ?", medicineLabel.MedicineUseID).First(&medicineUse); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicine_uses not found"})
		return
	}

	// 10: ค้นหา warning ด้วย id
	if tx := entity.DB().Where("id = ?", medicineLabel.WarningID).First(&warning); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "warnings not found"})
		return
	}

	// 11: ค้นหา employee ด้วย id
	if tx := entity.DB().Where("id = ?", medicineLabel.EmployeeID).First(&employee); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "employees not found"})
		return
	}
	// 12: สร้าง MedicineLabel
	wv := entity.MedicineLabel{
		MedicineUse:   medicineUse,                 // โยงความสัมพันธ์กับ Entity medicineuse
		Warning:       warning,                     // โยงความสัมพันธ์กับ Entity warning
		Employee:      employee,                    // โยงความสัมพันธ์กับ Entity employee
		RecordingDate: medicineLabel.RecordingDate, // ตั้งค่าฟิลด์ RecordingDate
	}

	// 13: บันทึก
	if err := entity.DB().Create(&wv).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": wv})
}

// GET /medicine_labels/:id
func GetMedicineLabel(c *gin.Context) {
	var medicineLabel entity.MedicineLabel
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM medicine_labels WHERE id = ?", id).Preload("MedicineUse").Preload("Warning").Find(&medicineLabel).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicineLabel})
}

// GET /medicine_labels
func ListMedicineLabel(c *gin.Context) {
	var medicineLabel []entity.MedicineLabel
	if err := entity.DB().Raw("SELECT * FROM medicine_labels").Preload("MedicineUse").Preload("Warning").Find(&medicineLabel).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// if err := entity.DB().Preload("MedicineUse").Preload("Warning").Preload("Employee").Raw("SELECT * FROM medicine_labels").Find(&MedicineLabel).Error; err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }

	c.JSON(http.StatusOK, gin.H{"data": medicineLabel})
}

// DELETE /medicine_labels/:id
func DeleteMedicineLabel(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM medicine_labels WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicine_labels not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /medicine_labels
func UpdateMedicineLabel(c *gin.Context) {
	var medicineLabel entity.MedicineLabel
	if err := c.ShouldBindJSON(&medicineLabel); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", medicineLabel.ID).First(&medicineLabel); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicine_labels not found"})
		return
	}

	if err := entity.DB().Save(&medicineLabel).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicineLabel})
}
