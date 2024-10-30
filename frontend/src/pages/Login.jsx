import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Gauge } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginUser } from "@/services/apiService";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await loginUser(values);
        console.log(response);
        formik.resetForm();

        if (response.data.token) {
          Cookies.set("userToken", response.data.token, {
            secure: true,
            sameSite: "Strict",
            expires: 5,
          });
        }
        navigate("/dashboard");
      } catch (error) {
        console.log("Error in login", error);
        toast.error(error?.response?.data?.error);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-200 to-blue-200">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-center space-x-2">
            <Gauge className="w-8 h-8" />
            <span className="text-2xl font-bold">Speedo</span>
          </div>
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email{" "}
                {formik.touched.email && formik.errors.email && (
                  <div className="text-sm text-red-500">
                    {formik.errors.email}
                  </div>
                )}
              </label>
              <Input
                id="email"
                placeholder="Example@email.com"
                type="email"
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
                  <div className="text-sm text-red-500">
                    {formik.errors.password}
                  </div>
                )}
              </label>
              <Input
                id="password"
                placeholder="At least 8 characters"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                autoComplete="new-password"
              />
            </div>
            <Button
              className="w-full bg-slate-800 hover:bg-slate-700"
              type="submit"
            >
              Sign in
            </Button>
          </form>
          <div className="text-center">
            Not an existing user? <Link to="/signup">Sign UP</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
