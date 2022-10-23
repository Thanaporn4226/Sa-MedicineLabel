package main

import (
	"github.com/Thanaporn4226/Project-sa-65/controller"
	"github.com/Thanaporn4226/Project-sa-65/entity"
	"github.com/Thanaporn4226/Project-sa-65/middlewares"
	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {

			c.AbortWithStatus(204)

			return

		}

		c.Next()

	}

}

func main() {
	entity.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	//Route API

	//admin part
	adminApi := r.Group("/admin")
	{
		protected := adminApi.Use(middlewares.AuthorizedAdmin())
		{
			//role
			protected.GET("/roles", controller.ListRoles)
			protected.GET("/role/:id", controller.GetRole)
			protected.POST("/role", controller.CreateRole)
			protected.PATCH("/role", controller.UpdateRole)
			protected.DELETE("/role/:id", controller.DeleteRole)

			//login
			//Don't have post because we will create login when create employee (1 - 1 relations)
			protected.GET("/logins", controller.ListLogin)
			protected.GET("/login/:id", controller.GetLogin)
			protected.PATCH("/login", controller.UpdateLogin)
			protected.DELETE("/login/:id", controller.DeleteLogin)

			//employee
			protected.GET("/employees", controller.ListEmployee)
			protected.GET("/employee/:id", controller.GetEmployee)
			protected.POST("/employee", controller.CreateEmployee)
			protected.PATCH("/employee", controller.UpdateEmployee)
			protected.DELETE("/employee/:id", controller.DeleteEmployee)

		}
	}

	//intendant (roleName intendant)
	intendantApi := r.Group("/medicine")
	{
		protected := intendantApi.Use(middlewares.AuthorizedIntendant())
		{
			//พี่เป้ กับ พี่ปาล์ม เพิ่ม API ตรงส่วนนี้ ในกรณีเรียกใช้ ให้เรียกใช้จาก /medicine/(...Route)
			protected.GET("/employee/:id", controller.GetEmployee)
			protected.GET("/employees", controller.ListEmployee)

			// Storage Routes
			protected.GET("/storage", controller.ListStorage)
			protected.GET("/storage/:id", controller.GetStorage)
			protected.POST("/storage", controller.CreateStorage)
			protected.PATCH("/storage", controller.UpdateStorage)
			protected.DELETE("/storage/:id", controller.DeleteStorage)

			// Type Routes
			protected.GET("/type", controller.ListType)
			protected.GET("/type/:id", controller.GetType)
			protected.POST("/type", controller.CreateType)
			protected.PATCH("/type", controller.UpdateType)
			protected.DELETE("/type/:id", controller.DeleteType)

			//Medicine Routes
			protected.GET("/medicine", controller.ListMedicine)
			protected.GET("/medicine/:id", controller.GetMedicine)
			protected.POST("/medicine", controller.CreateMedicine)
			protected.PATCH("/medicine", controller.UpdateMedicine)
			protected.DELETE("/medicine/:id", controller.DeleteMedicine)

		}
	}

	//pharmacist (roleName pharmacist)
	pharmacistApi := r.Group("/pharmacist")
	{
		protected := pharmacistApi.Use(middlewares.AuthorizedPharmacist())
		{
			//เพชร พี่แบม และพี่แบม เพิ่ม API ตรงส่วนนี้ ในกรณีเรียกใช้ ให้เรียกใช้จาก /phamacist/(...Route)
			protected.GET("/employee/:id", controller.GetEmployee)
			protected.GET("/employees", controller.ListEmployee)

			//perscriptions
			protected.GET("/prescriptions", controller.ListPrescription)
			protected.GET("/prescriptions/:id", controller.GetPrescription)
			protected.POST("/prescriptions", controller.CreatePrescription)
			//medicine Label
			protected.GET("/medicinelabels", controller.ListMedicineLabel)
			protected.GET("/medicinelabels/:id", controller.GetMedicineLabel)
			protected.POST("/medicinelabels", controller.CreateMedicineLabel)

			//pay Medicines
			protected.GET("/paymedicines", controller.ListPayMedicine)
			protected.GET("/paymedicines/:id", controller.GetPayMedicine)
			protected.POST("/paymedicines", controller.CreatePayMedicine)
			protected.PATCH("/paymedicines", controller.UpdatePayMedicine)
			protected.DELETE("/paymedicines/:id", controller.DeletePayMedicine)

			//MedicineLabel
			protected.GET("/medicine_labels", controller.ListMedicineLabel)
			protected.GET("/medicine_labels/:id", controller.GetMedicineLabel)
			protected.POST("/medicine_labels", controller.CreateMedicineLabel)
			protected.PATCH("/medicine_labels", controller.UpdateMedicineLabel)
			protected.DELETE("/medicine_labels/:id", controller.DeleteMedicineLabel)

			//MedicineUse
			protected.GET("/medicine_uses", controller.ListMedicineUse)
			protected.GET("/medicine_uses/:id", controller.GetMedicineUse)
			protected.POST("/medicine_uses", controller.CreateMedicineUse)
			protected.PATCH("/medicine_uses", controller.UpdateMedicineUse)
			protected.DELETE("/medicine_uses/:id", controller.DeleteMedicineUse)

			//Warning
			protected.GET("/warnings", controller.ListWarning)
			protected.GET("/warnings/:id", controller.GetWarning)
			protected.POST("/warnings", controller.CreateWarning)
			protected.PATCH("/warnings", controller.UpdateWarning)
			protected.DELETE("/warnings/:id", controller.DeleteWarning)

		}
	}

	//payment (roleName payment)
	paymentApi := r.Group("/payment")
	{
		protected := paymentApi.Use(middlewares.AuthorizedPharmacist())
		{
			//พี่ก็อต เพิ่ม API ตรงส่วนนี้ ในกรณีเรียกใช้ ให้เรียกใช้จาก /payment/(...Route)
			protected.GET("/employee/:id", controller.GetEmployee)

		}
	}

	//all user login can use
	api := r.Group("")
	{
		protected := api.Use(middlewares.Authorized())
		{
			protected.GET("/employee/:id", controller.GetEmployee)
		}
	}

	//For signin (Auth Route)
	r.POST("/signin", controller.Signin)

	//for check token
	r.GET("/valid", controller.Validation)

	r.Run()
}
