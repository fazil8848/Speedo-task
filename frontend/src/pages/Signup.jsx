import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Gauge } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { registerUser } from "@/services/apiService";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

export default function Singup() {

  const navigate = useNavigate();
  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  const validationSchema = Yup.object({
    userName: Yup.string()
      .required("User Name is required")
      .min(4, "Username must be atleast 4 charecter long")
      .max(15, "Username must only contain 15 charecters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .matches(passwordRules, { message: "Please create a stronger password" })
      .min(8, "Password must contain a minimum of 8 charecters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Password must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await registerUser(values);

        formik.resetForm();
        toast.success(response.data.message);
        if (response.data.token) {
          Cookies.set("userToken", response.data.token, {
            secure: true,
            sameSite: "Strict",
            expires: 5,
          });
        }
        navigate("/dashboard");
      } catch (error) {
        console.log(error);
        toast.error("User registration failed");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-200 to-blue-200 py-10">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-center space-x-2">
            <Gauge className="w-8 h-8" />
            <span className="text-2xl font-bold">Speedo</span>
          </div>
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                User Name
                {formik.touched.userName && formik.errors.userName && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.userName}
                  </div>
                )}
              </label>
              <Input
                id="userName"
                placeholder="Enter your Name"
                type="text"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.userName}
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.email}
                  </div>
                )}
              </label>
              <Input
                id="email"
                placeholder="Example@email.com"
                type="email"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password{" "}
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.password}
                  </div>
                )}
              </label>
              <Input
                id="password"
                placeholder="At least 8 characters"
                type="password"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password{" "}
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <div className="text-sm text-red-500">
                      {formik.errors.confirmPassword}
                    </div>
                  )}
              </label>
              <Input
                id="confirmPassword"
                placeholder="Conifrm Your Password"
                type="password"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                autoComplete="new-password"
              />
            </div>
            <Button
              className="w-full bg-slate-800 hover:bg-slate-700"
              type="submit"
              // onClick={formik.handleSubmit}
            >
              Sign Up
            </Button>
          </form>

          <div className="text-center">
            Already have an account? <Link to="/">Login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
