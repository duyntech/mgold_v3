
import { useAppSelector } from "../../app/hooks";
import DashboardCounter from "../../components/dashboard/DashboardCounter";
import DashboardSurvey from "../../components/dashboard/DashboardSurvey";
import { ProgressSpinner } from 'primereact/progressspinner';
export default function DashBoard() {
    const reportState = useAppSelector(state => state.report)
    return (
        <div className="position-relative">
            <div className="row">
                <DashboardCounter />
                <DashboardSurvey />
            </div>
            {reportState.statisticStatus && reportState.statisticStatus.status === "loading" || reportState.revenueDetailStatus && reportState.revenueDetailStatus.status === "loading" &&
                <div className="w-100 h-100 position-absolute d-flex flex-column align-items-center" style={{ top: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: 10 }}>
                    <div style={{ height: 160 }}></div>
                    <ProgressSpinner animationDuration=".5s" />
                </div>
            }
        </div>

    )
}