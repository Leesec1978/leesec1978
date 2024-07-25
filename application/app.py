import streamlit as st
import pandas as pd
import os
from pathlib import Path
import re
from datetime import datetime, date
import json
from scipy import stats
import statsmodels.api as sm
from statsmodels.formula.api import ols
import plotly.express as px
import plotly.graph_objects as go

# Set page config to wide layout
st.set_page_config(page_title="Data Analysis App", layout="wide", initial_sidebar_state="expanded")

# Constants
COLUMNS_TO_READ = [
    'sheetStart', 'shift', 'section', 'employeeCode', 'employeeName',
    'category', 'subCategory', 'activityCode', 'activity', 'blockStart',
    'periodStart', 'periodName', 'workedStart', 'workedMinutes'
]
PIVOT_COLUMNS = [
    'shift', 'section', 'employeeCode', 'employeeName', 'category',
    'subCategory', 'activityCode', 'activity', 'periodName', 'workedMinutes',
    'workedHours', 'Date', 'Day', 'Wk no', 'Month', 'Quarter'
]

def extract_rows_by_date_range(folder_path, start_date, end_date):
    """Extract rows from CSV files within a date range."""
    data_frames = []
    start_date, end_date = pd.to_datetime(start_date), pd.to_datetime(end_date)
    
    for file_path in Path(folder_path).glob('*.csv'):
        try:
            df = pd.read_csv(file_path, usecols=COLUMNS_TO_READ)
            df['sheetStart'] = pd.to_datetime(df['sheetStart'].str[:10], errors='coerce')
            filtered_df = df[(df['sheetStart'] >= start_date) & (df['sheetStart'] <= end_date)].copy()
            if not filtered_df.empty:
                filtered_df['source_file'] = file_path.name
                filtered_df['workedHours'] = filtered_df['workedMinutes'] / 60
                data_frames.append(filtered_df)
        except Exception as e:
            st.error(f"Error processing {file_path.name}: {e}")
    
    return pd.concat(data_frames, ignore_index=True) if data_frames else pd.DataFrame()

def merge_with_financial_periods(filtered_data, financial_periods_df):
    """Merge filtered data with financial periods data."""
    filtered_data['sheetStart'] = pd.to_datetime(filtered_data['sheetStart'], errors='coerce')
    financial_periods_df['Date'] = pd.to_datetime(financial_periods_df['Date'], errors='coerce')
    return pd.merge(filtered_data, financial_periods_df, left_on='sheetStart', right_on='Date', how='left')

def get_next_sequence_number(output_directory):
    """Get the next sequence number for the output file."""
    files = os.listdir(output_directory)
    sequence_numbers = [
        int(re.match(r'filtered_merged_data_(\d+).csv', file).group(1))
        for file in files if re.match(r'filtered_merged_data_(\d+).csv', file)
    ]
    return max(sequence_numbers, default=0) + 1

def convert_settings_for_saving(settings):
    """Convert datetime objects to strings for saving settings."""
    for key, value in settings['filters'].items():
        if isinstance(value, list):
            settings['filters'][key] = [v.isoformat() if isinstance(v, (datetime, date)) else v for v in value]
        elif isinstance(value, (datetime, date)):
            settings['filters'][key] = value.isoformat()
    return settings

def convert_settings_for_loading(settings):
    """Convert strings back to datetime objects for loading settings."""
    for key, value in settings['filters'].items():
        if isinstance(value, list):
            settings['filters'][key] = [datetime.fromisoformat(v) if 'T' in v else date.fromisoformat(v) for v in value]
        elif isinstance(value, str) and 'T' in value:
            settings['filters'][key] = datetime.fromisoformat(value)
        elif isinstance(value, str):
            settings['filters'][key] = date.fromisoformat(value)
    return settings

def calculate_descriptive_statistics(df, column):
    """Calculate descriptive statistics for a given column."""
    desc = df[column].describe()
    mode = df[column].mode().iloc[0] if not df[column].mode().empty else None
    descriptive_stats = desc.to_dict()
    descriptive_stats['Mode'] = mode
    return descriptive_stats

def perform_t_test(df, column, group_column, group1, group2):
    """Perform t-test between two groups."""
    group1_data = df[df[group_column] == group1][column].dropna().astype(float)
    group2_data = df[df[group_column] == group2][column].dropna().astype(float)
    return stats.ttest_ind(group1_data, group2_data, equal_var=False)

def perform_welchs_t_test(df, column, group_column, group1, group2):
    """Perform Welch's T-Test between two groups."""
    group1_data = df[df[group_column] == group1][column].dropna().astype(float)
    group2_data = df[df[group_column] == group2][column].dropna().astype(float)
    return stats.ttest_ind(group1_data, group2_data, equal_var=False)

def perform_anova(df, dependent_var, independent_var):
    """Perform ANOVA test."""
    df[dependent_var] = df[dependent_var].astype(float)
    model = ols(f'{dependent_var} ~ C({independent_var})', data=df).fit()
    return sm.stats.anova_lm(model, typ=2)

def perform_mann_whitney_u_test(df, column, group_column, group1, group2):
    """Perform Mann-Whitney U Test between two groups."""
    group1_data = df[df[group_column] == group1][column].dropna().astype(float)
    group2_data = df[df[group_column] == group2][column].dropna().astype(float)
    return stats.mannwhitneyu(group1_data, group2_data)

def perform_kruskal_wallis_test(df, column, group_column):
    """Perform Kruskal-Wallis Test comparing multiple groups."""
    groups = [df[df[group_column] == group][column].dropna().astype(float) for group in df[group_column].unique()]
    return stats.kruskal(*groups)

def perform_correlation_analysis(df, group1, group2):
    """Perform correlation analysis by grouping two items."""
    pivot_df = df.pivot_table(values='mean_workedHours', index=group1, columns=group2, aggfunc='mean', fill_value=0)
    return pivot_df.corr()

def visualize_t_test(df, group_column, group1, group2, column):
    """Visualize t-test results."""
    data = df[df[group_column].isin([group1, group2])]
    fig_hist = px.histogram(data, x=column, color=group_column, nbins=30,
                            title="T-Test Results - Histogram", marginal="box", histnorm='density')
    
    fig_box = px.box(data, x=group_column, y=column, title="T-Test Results - Box Plot")

    fig_violin = px.violin(data, x=group_column, y=column, box=True, points="all",
                           title="T-Test Results - Violin Plot")
    
    return fig_hist, fig_box, fig_violin

def visualize_anova(df, group_column, column):
    """Visualize ANOVA results."""
    fig_box = px.box(df, x=group_column, y=column, title="ANOVA Results - Box Plot")
    
    fig_violin = px.violin(df, x=group_column, y=column, box=True, points="all", title="ANOVA Results - Violin Plot")

    means = df.groupby(group_column)[column].mean().reset_index()
    std_errors = df.groupby(group_column)[column].sem().reset_index()
    fig_bar = go.Figure(data=[
        go.Bar(name='Mean', x=means[group_column], y=means[column], error_y=dict(type='data', array=std_errors[column]))
    ])
    fig_bar.update_layout(title="ANOVA Results - Bar Chart with Error Bars", xaxis_title=group_column, yaxis_title=column)
    
    return fig_box, fig_violin, fig_bar

def visualize_correlation_matrix(corr_matrix):
    """Visualize correlation matrix."""
    return px.imshow(corr_matrix, text_auto=True, title="Correlation Matrix")

def interpret_correlation_matrix(corr_matrix):
    """Interpret the correlation matrix."""
    interpretations = []
    for i in range(len(corr_matrix.columns)):
        for j in range(i + 1, len(corr_matrix.columns)):
            col1, col2 = corr_matrix.columns[i], corr_matrix.columns[j]
            corr_value = corr_matrix.iloc[i, j]
            strength = ('very strong' if corr_value > 0.8 else
                        'strong' if corr_value > 0.6 else
                        'moderate' if corr_value > 0.4 else
                        'weak' if corr_value > 0.2 else 'very weak')
            direction = 'positive' if corr_value >= 0 else 'negative'
            interpretations.append(f"The correlation between {col1} and {col2} is {strength} ({direction}) with a value of {corr_value:.2f}.")
    return interpretations

def visualize_descriptive_stats(stats):
    """Visualize descriptive statistics."""
    stats_df = pd.DataFrame.from_dict(stats, orient='index', columns=['Value'])
    stats_df = stats_df.drop([key for key in ['Variance', 'Count'] if key in stats_df.index])
    return px.bar(stats_df, x=stats_df.index, y='Value', title="Descriptive Statistics")

def visualize_distribution(df, column):
    """Visualize distribution of a column."""
    return px.histogram(df, x=column, nbins=30, title=f"Distribution of {column}")

def test_normality(df, column):
    """Perform Shapiro-Wilk test for normality."""
    return stats.shapiro(df[column].dropna().astype(float))

def test_homogeneity_of_variance(df, column, group_column):
    """Perform Levene's test for homogeneity of variances."""
    groups = [df[df[group_column] == group][column].dropna().astype(float) for group in df[group_column].unique()]
    return stats.levene(*groups)

# Initialize session state for settings
if 'settings' not in st.session_state:
    st.session_state.settings = {}
if 'settings_applied' not in st.session_state:
    st.session_state.settings_applied = False

# Initialize session state for pivot table
if 'pivot_table' not in st.session_state:
    st.session_state.pivot_table = None
if 'pivot_table_analysis' not in st.session_state:
    st.session_state.pivot_table_analysis = None

# Streamlit app layout
st.title("CSV Date Range Filter, Merge, and Export")

# Create tabs for different functionalities
tab1, tab2, tab3, tab4 = st.tabs(["Filter and Export", "Interactive Pivot Table & Charts", "Statistical Analysis", "Detailed Analysis"])

# Filter and Export Tab
with tab1:
    folder_path = st.text_input("Enter the folder path containing the CSV files")
    financial_periods_path = st.text_input(
        "Enter the path to the Financial Periods CSV file",
        value='W:/Wages/Pay_Roll_Monthly/Daily staffing sheets/Sid5 extracts/Ref/Financial_Periods.csv'
    )
    output_directory = st.text_input(
        "Enter the path to save the created CSV file",
        value='W:/Wages/Pay_Roll_Monthly/Daily staffing sheets/Sid5 extracts/created CSV file'
    )

    if folder_path and os.path.isdir(folder_path):
        start_date = st.date_input("Select the start date")
        end_date = st.date_input("Select the end date")

        if start_date > end_date:
            st.error("Error: End date must be after start date.")
        else:
            if st.button("Filter Rows and Export"):
                filtered_data = extract_rows_by_date_range(folder_path, start_date, end_date)
                if not filtered_data.empty:
                    financial_periods_df = pd.read_csv(financial_periods_path)
                    merged_data = merge_with_financial_periods(filtered_data, financial_periods_df)
                    os.makedirs(output_directory, exist_ok=True)
                    next_sequence_number = get_next_sequence_number(output_directory)
                    output_file_path = os.path.join(output_directory, f'filtered_merged_data_{next_sequence_number}.csv')
                    merged_data.to_csv(output_file_path, index=False)
                    st.success(f"Filtered and merged data has been exported to {output_file_path}")
                else:
                    st.write("No matching rows found.")
    else:
        st.write("Please enter a valid folder path.")

# Sidebar Filters
def add_select_all_option(options):
    return ["Select All"] + options.tolist()

def apply_filters(df, filters):
    filtered_df = df.copy()
    filtered_df['Date'] = filtered_df['Date'].dt.date  # Ensure 'Date' column is of type date
    for key, value in filters.items():
        if key == 'Date' and 'Date' in filtered_df.columns:
            filtered_df = filtered_df[(filtered_df['Date'] >= value[0]) & (filtered_df['Date'] <= value[1])]
        elif key in filtered_df.columns and isinstance(value, list) and "Select All" not in value:
            filtered_df = filtered_df[filtered_df[key].isin(value)]
    return filtered_df

def display_filters_sidebar(df, tab_key):
    filters = {
        'shift': st.sidebar.multiselect(f'Filter by Shift', options=add_select_all_option(df['shift'].unique()), default=["Select All"], key=f'shift_filter_{tab_key}'),
        'section': st.sidebar.multiselect(f'Filter by Section', options=add_select_all_option(df['section'].unique()), default=["Select All"], key=f'section_filter_{tab_key}'),
        'employeeCode': st.sidebar.multiselect(f'Filter by Employee Code', options=add_select_all_option(df['employeeCode'].unique()), default=["Select All"], key=f'employeeCode_filter_{tab_key}'),
        'employeeName': st.sidebar.multiselect(f'Filter by Employee Name', options=add_select_all_option(df['employeeName'].unique()), default=["Select All"], key=f'employeeName_filter_{tab_key}'),
        'category': st.sidebar.multiselect(f'Filter by Category', options=add_select_all_option(df['category'].unique()), default=["Select All"], key=f'category_filter_{tab_key}'),
        'subCategory': st.sidebar.multiselect(f'Filter by Sub Category', options=add_select_all_option(df['subCategory'].unique()), default=["Select All"], key=f'subCategory_filter_{tab_key}'),
        'activityCode': st.sidebar.multiselect(f'Filter by Activity Code', options=add_select_all_option(df['activityCode'].unique()), default=["Select All"], key=f'activityCode_filter_{tab_key}'),
        'activity': st.sidebar.multiselect(f'Filter by Activity', options=add_select_all_option(df['activity'].unique()), default=["Select All"], key=f'activity_filter_{tab_key}'),
        'periodName': st.sidebar.multiselect(f'Filter by Period Name', options=add_select_all_option(df['periodName'].unique()), default=["Select All"], key=f'periodName_filter_{tab_key}'),
        'Date': st.sidebar.slider(f'Filter by Date', min_value=df['Date'].min().date(), max_value=df['Date'].max().date(), value=(df['Date'].min().date(), df['Date'].max().date()), format="YYYY-MM-DD", key=f'date_filter_{tab_key}') if 'Date' in df.columns else st.sidebar.text("No Date column"),
        'Day': st.sidebar.multiselect(f'Filter by Day', options=add_select_all_option(df['Day'].unique()), default=["Select All"], key=f'day_filter_{tab_key}'),
        'Wk no': st.sidebar.multiselect(f'Filter by Wk no', options=add_select_all_option(df['Wk no'].unique()), default=["Select All"], key=f'wk_no_filter_{tab_key}') if 'Wk no' in df.columns else st.sidebar.text("No Wk no column"),
        'Month': st.sidebar.multiselect(f'Filter by Month', options=add_select_all_option(df['Month'].unique()), default=["Select All"], key=f'month_filter_{tab_key}'),
        'Quarter': st.sidebar.multiselect(f'Filter by Quarter', options=add_select_all_option(df['Quarter'].unique()), default=["Select All"], key=f'quarter_filter_{tab_key}') if 'Quarter' in df.columns else st.sidebar.text("No Quarter column")
    }
    return filters

# Interactive Pivot Table & Charts Tab
with tab2:
    st.write("Interactive Pivot Table & Charts")
    file_path = st.text_input("Enter the path to the CSV file for pivot table and charts")

    if file_path:
        st.session_state.file_path = file_path

    if 'file_path' in st.session_state:
        file_path = st.session_state.file_path

    if file_path and os.path.isfile(file_path):
        df = pd.read_csv(file_path)
        df['Date'] = pd.to_datetime(df.get('Date'), errors='coerce')
        df['Wk no'] = pd.to_numeric(df.get('Wk no'), errors='coerce')
        df['Quarter'] = pd.to_numeric(df.get('Quarter'), errors='coerce')

        filters = display_filters_sidebar(df, "tab2")

        if st.button("Apply Filters", key='apply_filters_tab2'):
            st.session_state.filters_tab2 = filters

        if 'filters_tab2' in st.session_state:
            filters = st.session_state.filters_tab2

        filtered_df = apply_filters(df, filters)

        pivot_columns_selection = st.multiselect("Select columns for the pivot table", PIVOT_COLUMNS + ['Date'], key='pivot_columns_selection_tab2')

        if pivot_columns_selection:
            try:
                pivot_table = pd.pivot_table(
                    filtered_df,
                    values=['workedMinutes', 'workedHours'],
                    index=pivot_columns_selection,
                    aggfunc={'workedMinutes': 'sum', 'workedHours': 'sum'}
                ).reset_index()
                st.session_state.pivot_table = pivot_table  # Store pivot table in session state
                st.write("Filtered Pivot Table:", pivot_table)
            except ValueError as e:
                st.error(f"Error creating pivot table: {e}")

            # Add chart selection widgets below the chart in smaller columns
            col1, col2, col3, col4 = st.columns(4)
            with col1:
                x_axis = st.selectbox("Select X-axis for the chart", PIVOT_COLUMNS + ['Date'], index=0, key='x_axis_tab2')
            with col2:
                color_column = st.selectbox("Select column to color by", options=PIVOT_COLUMNS + ['Date'], index=0, key='color_column_tab2')
            with col3:
                chart_type = st.selectbox("Select chart type", [
                    'Bar Chart', 'Line Graph', 'Scatter Plot', 'Pie Chart', 'Area Chart',
                    'Bubble Chart', 'Column Chart', 'Stacked Column Chart', 'Histogram', 'Box Plot', 'Heat Map'
                ], key='chart_type_tab2')
            with col4:
                y_axis = st.multiselect("Select Y-axis for the chart", ['workedMinutes', 'workedHours'], default=['workedMinutes'], key='y_axis_tab2')

            if x_axis and y_axis and chart_type:
                if color_column not in pivot_table.columns:
                    color_column = None

                fig = None
                title = f"{', '.join(y_axis).replace('_', ' ').title()} by {x_axis.replace('_', ' ').title()}"

                if x_axis not in pivot_table.columns:
                    st.error(f"The selected X-axis column ({x_axis}) does not exist in the data.")
                elif any(y not in pivot_table.columns for y in y_axis):
                    st.error(f"One or more of the selected Y-axis columns ({y_axis}) do not exist in the data.")
                else:
                    if chart_type == 'Bar Chart':
                        fig = px.bar(pivot_table, x=x_axis, y=y_axis, color=color_column, title=title)
                    elif chart_type == 'Line Graph':
                        valid_y_axis = [col for col in y_axis if col in pivot_table.columns]
                        if valid_y_axis:
                            pivot_table['combined_y'] = pivot_table[valid_y_axis].sum(axis=1)
                            title = f"{' + '.join(valid_y_axis).replace('_', ' ').title()} Combined by {x_axis.replace('_', ' ').title()}"
                            fig = px.line(pivot_table, x=x_axis, y='combined_y', title=title)
                        else:
                            st.error(f"None of the selected Y-axis columns ({y_axis}) are available in the pivot table.")
                    elif chart_type == 'Scatter Plot':
                        fig = px.scatter(pivot_table, x=x_axis, y=y_axis, color=color_column, title=title)
                    elif chart_type == 'Pie Chart':
                        fig = px.pie(pivot_table, names=x_axis, values=y_axis[0], title=title)
                    elif chart_type == 'Area Chart':
                        fig = px.area(pivot_table, x=x_axis, y=y_axis, color=color_column, title=title)
                    elif chart_type == 'Bubble Chart':
                        if y_axis[0] in pivot_table.columns:
                            fig = px.scatter(pivot_table, x=x_axis, y=y_axis, size=y_axis[0], color=color_column, title=title)
                        else:
                            st.error(f"Column '{y_axis[0]}' is not available in the data for the size parameter of the Bubble Chart.")
                    elif chart_type == 'Column Chart':
                        fig = px.bar(pivot_table, x=x_axis, y=y_axis, color=color_column, title=title, barmode='group')
                    elif chart_type == 'Stacked Column Chart':
                        fig = px.bar(pivot_table, x=x_axis, y=y_axis, color=color_column, title=title, barmode='stack')
                    elif chart_type == 'Histogram':
                        fig = px.histogram(pivot_table, x=x_axis, y=y_axis, color=color_column, title=title)
                    elif chart_type == 'Box Plot':
                        fig = px.box(pivot_table, x=x_axis, y=y_axis, color=color_column, title=title)
                    elif chart_type == 'Heat Map':
                        fig = px.density_heatmap(pivot_table, x=x_axis, y=y_axis, title=title)

                    if fig:
                        fig.update_layout(
                            title={
                                'text': title,
                                'y': 0.9,
                                'x': 0.5,
                                'xanchor': 'center',
                                'yanchor': 'top'
                            },
                            font=dict(
                                size=20,
                                color="Black"
                            )
                        )
                        st.plotly_chart(fig)
            else:
                st.warning("Please select both X-axis and Y-axis for the chart.")

        with st.sidebar:
            json_save_directory = st.text_input("Enter the directory path to save the settings JSON file", key='json_save_directory_tab2')
            save_settings = st.button("Save Settings", key='save_settings_tab2')
            load_settings_file = st.file_uploader("Load Settings", type=["json"], key='load_settings_file_tab2')
            load_settings_button = st.button("Load Settings", key='load_settings_button_tab2')

        def convert_to_serializable(obj):
            if isinstance(obj, (datetime, date)):
                return obj.isoformat()
            return str(obj)

        if save_settings and json_save_directory:
            if os.path.isdir(json_save_directory):
                settings = {
                    'filters': {key: value for key, value in filters.items()},
                    'pivot_columns_selection': pivot_columns_selection,
                    'x_axis': x_axis,
                    'y_axis': y_axis,
                    'color_column': color_column,
                    'chart_type': chart_type
                }
                settings = convert_settings_for_saving(settings)
                json_save_path = os.path.join(json_save_directory, 'settings.json')
                with open(json_save_path, 'w') as f:
                    json.dump(settings, f, default=convert_to_serializable)
                st.success(f"Settings saved successfully to {json_save_path}")
            else:
                st.error("Invalid directory path")

        if load_settings_file and load_settings_button:
            loaded_settings = json.load(load_settings_file)
            loaded_settings = convert_settings_for_loading(loaded_settings)
            st.session_state.settings = loaded_settings
            st.session_state.settings_applied = False
            st.rerun()

        if st.session_state.settings and not st.session_state.settings_applied:
            settings = st.session_state.settings
            st.session_state.settings_applied = True
            st.rerun()
    else:
        st.warning("Please enter a valid file path.")

























        

# Statistical Analysis Tab
with tab3:
    st.header("Statistical Analysis")

    if 'file_path' in st.session_state:
        file_path = st.session_state.file_path

    if file_path and os.path.isfile(file_path):
        df = pd.read_csv(file_path)
        df['Date'] = pd.to_datetime(df.get('Date'), errors='coerce')
        df['Wk no'] = pd.to_numeric(df.get('Wk no'), errors='coerce')
        df['Quarter'] = pd.to_numeric(df.get('Quarter'), errors='coerce')

        filters = display_filters_sidebar(df, "tab3")    

        # Directly apply filters without needing an "Apply Filters" button
        st.session_state.filters_tab3 = filters

        if 'filters_tab2' in st.session_state:  # Use filters from tab2 if available
            filters = st.session_state.filters_tab2

        filtered_df = apply_filters(df, filters)

        pivot_columns_selection = st.multiselect("Select columns for the pivot table", PIVOT_COLUMNS, key='pivot_columns_selection_tab3')

        if pivot_columns_selection:
            pivot_columns_selection_with_date = pivot_columns_selection + ['Date']
            try:
                pivot_table_analysis = pd.pivot_table(
                    filtered_df,
                    values=['workedMinutes', 'workedHours'],
                    index=pivot_columns_selection_with_date,
                    aggfunc={'workedMinutes': 'sum', 'workedHours': 'sum'}
                ).reset_index()
                if 'workedHours' not in pivot_table_analysis.columns:
                    pivot_table_analysis['workedHours'] = pivot_table_analysis['workedMinutes'] / 60
                # Calculate mean_workedHours by averaging workedHours by day for each group
                pivot_table_analysis['mean_workedHours'] = pivot_table_analysis.groupby(pivot_columns_selection)['workedHours'].transform('mean')
                pivot_table_analysis = pivot_table_analysis.drop_duplicates(subset=pivot_columns_selection + ['Date'])

                st.session_state.pivot_table_analysis = pivot_table_analysis  # Store pivot table for analysis in session state
                st.write("Filtered Pivot Table:", pivot_table_analysis)
            except ValueError as e:
                st.error(f"Error creating pivot table: {e}")

            numeric_columns = pivot_table_analysis.select_dtypes(include='number').columns.tolist()
            if 'employeeCode' in numeric_columns:
                numeric_columns.remove('employeeCode')

            if not numeric_columns:
                st.warning("The pivot table does not contain any numeric columns for statistical analysis.")
            else:
                # Descriptive Statistics
                st.subheader("Descriptive Statistics")
                desc_column = st.selectbox("Select Column for Descriptive Statistics", numeric_columns, key='desc_column_tab3')
                if desc_column:
                    desc_stats = calculate_descriptive_statistics(pivot_table_analysis, desc_column)
                    st.write("Descriptive Statistics Table")
                    st.write(pd.DataFrame([desc_stats]))
                    st.plotly_chart(visualize_descriptive_stats(desc_stats))
                    st.plotly_chart(visualize_distribution(pivot_table_analysis, desc_column))

                # Inferential Statistics
                st.subheader("Inferential Statistics")

                # T-Test
                st.write("### T-Test between groups")
                group_column = st.selectbox("Select column for grouping", [col for col in pivot_columns_selection if col in pivot_table_analysis.columns], key='t_test_group_column_tab3')
                if group_column in pivot_table_analysis.columns:
                    group1 = st.selectbox("Select first group for T-Test", pivot_table_analysis[group_column].unique(), key='t_test_group1_tab3')
                    group2 = st.selectbox("Select second group for T-Test", pivot_table_analysis[group_column].unique(), key='t_test_group2_tab3')
                    t_test_column = st.selectbox("Select column for T-Test", ['mean_workedHours'], key='t_test_column_tab3')
                    if st.button("Run T-Test", key='run_t_test_tab3'):
                        t_test_result = perform_t_test(pivot_table_analysis, t_test_column, group_column, group1, group2)
                        st.write("T-Test Result:", t_test_result)
                        fig_hist, fig_box, fig_violin = visualize_t_test(pivot_table_analysis, group_column, group1, group2, t_test_column)
                        st.plotly_chart(fig_hist)
                        st.plotly_chart(fig_box)
                        st.plotly_chart(fig_violin)

                        st.write(f"T-test Statistic: {t_test_result.statistic}")
                        st.write(f"P-Value: {t_test_result.pvalue}")
                        
                        if t_test_result.pvalue < 0.05:
                            st.write("Interpretation: The p-value is less than 0.05, indicating a statistically significant difference between the means of the two groups. We reject the null hypothesis that the means are equal.")
                        else:
                            st.write("Interpretation: The p-value is greater than 0.05, indicating no statistically significant difference between the means of the two groups. We fail to reject the null hypothesis that the means are equal.")
                else:
                    st.error(f"Column '{group_column}' does not exist in the pivot table.")

                # Welch's T-Test
                st.write("### Welch's T-Test between groups")
                welch_group_column = st.selectbox("Select column for grouping", [col for col in pivot_columns_selection if col in pivot_table_analysis.columns], key='welch_group_column_tab3')
                if welch_group_column in pivot_table_analysis.columns:
                    welch_group1 = st.selectbox("Select first group for Welch's T-Test", pivot_table_analysis[welch_group_column].unique(), key='welch_group1_tab3')
                    welch_group2 = st.selectbox("Select second group for Welch's T-Test", pivot_table_analysis[welch_group_column].unique(), key='welch_group2_tab3')
                    welch_column = st.selectbox("Select column for Welch's T-Test", ['mean_workedHours'], key='welch_column_tab3')
                    if st.button("Run Welch's T-Test", key='run_welch_t_test_tab3'):
                        welch_result = perform_welchs_t_test(pivot_table_analysis, welch_column, welch_group_column, welch_group1, welch_group2)
                        st.write("Welch's T-Test Result:", welch_result)
                        fig_hist, fig_box, fig_violin = visualize_t_test(pivot_table_analysis, welch_group_column, welch_group1, welch_group2, welch_column)
                        st.plotly_chart(fig_hist)
                        st.plotly_chart(fig_box)
                        st.plotly_chart(fig_violin)

                        st.write(f"Welch's T-test Statistic: {welch_result.statistic}")
                        st.write(f"P-Value: {welch_result.pvalue}")
                        
                        if welch_result.pvalue < 0.05:
                            st.write("Interpretation: The p-value is less than 0.05, indicating a statistically significant difference between the means of the two groups. We reject the null hypothesis that the means are equal.")
                        else:
                            st.write("Interpretation: The p-value is greater than 0.05, indicating no statistically significant difference between the means of the two groups. We fail to reject the null hypothesis that the means are equal.")
                else:
                    st.error(f"Column '{welch_group_column}' does not exist in the pivot table.")

                # ANOVA
                st.write("### ANOVA comparing groups")
                anova_column = st.selectbox("Select column for ANOVA", ['mean_workedHours'], key='anova_column_tab3')
                anova_group_column = st.selectbox("Select grouping column for ANOVA", [col for col in pivot_columns_selection if col in pivot_table_analysis.columns], key='anova_group_column_tab3')
                if anova_group_column in pivot_table_analysis.columns:
                    if st.button("Run ANOVA", key='run_anova_tab3'):
                        anova_result = perform_anova(pivot_table_analysis, anova_column, anova_group_column)
                        st.write("ANOVA Result:")
                        st.write(anova_result)
                        fig_box, fig_violin, fig_bar = visualize_anova(pivot_table_analysis, anova_group_column, anova_column)
                        st.plotly_chart(fig_box)
                        st.plotly_chart(fig_violin)
                        st.plotly_chart(fig_bar)

                        st.write(f"F-Statistic: {anova_result['F'][0]}")
                        st.write(f"P-Value: {anova_result['PR(>F)'][0]}")
                        
                        if anova_result['PR(>F)'][0] < 0.05:
                            st.write("Interpretation: The p-value is less than 0.05, indicating a statistically significant difference between the means of the groups. We reject the null hypothesis that the group means are equal.")
                        else:
                            st.write("Interpretation: The p-value is greater than 0.05, indicating no statistically significant difference between the means of the groups. We fail to reject the null hypothesis that the group means are equal.")
                else:
                    st.error(f"Column '{anova_group_column}' does not exist in the pivot table.")

                # Mann-Whitney U Test
                st.write("### Mann-Whitney U Test between groups")
                mann_whitney_group_column = st.selectbox("Select column for grouping", [col for col in pivot_columns_selection if col in pivot_table_analysis.columns], key='mann_whitney_group_column_tab3')
                if mann_whitney_group_column in pivot_table_analysis.columns:
                    mann_whitney_group1 = st.selectbox("Select first group for Mann-Whitney U Test", pivot_table_analysis[mann_whitney_group_column].unique(), key='mann_whitney_group1_tab3')
                    mann_whitney_group2 = st.selectbox("Select second group for Mann-Whitney U Test", pivot_table_analysis[mann_whitney_group_column].unique(), key='mann_whitney_group2_tab3')
                    mann_whitney_column = st.selectbox("Select column for Mann-Whitney U Test", ['mean_workedHours'], key='mann_whitney_column_tab3')
                    if st.button("Run Mann-Whitney U Test", key='run_mann_whitney_u_test_tab3'):
                        mann_whitney_result = perform_mann_whitney_u_test(pivot_table_analysis, mann_whitney_column, mann_whitney_group_column, mann_whitney_group1, mann_whitney_group2)
                        st.write("Mann-Whitney U Test Result:", mann_whitney_result)
                        fig_hist, fig_box, fig_violin = visualize_t_test(pivot_table_analysis, mann_whitney_group_column, mann_whitney_group1, mann_whitney_group2, mann_whitney_column)
                        st.plotly_chart(fig_hist)
                        st.plotly_chart(fig_box)
                        st.plotly_chart(fig_violin)

                        st.write(f"Mann-Whitney U Test Statistic: {mann_whitney_result.statistic}")
                        st.write(f"P-Value: {mann_whitney_result.pvalue}")
                        
                        if mann_whitney_result.pvalue < 0.05:
                            st.write("Interpretation: The p-value is less than 0.05, indicating a statistically significant difference between the distributions of the two groups. We reject the null hypothesis that the distributions are equal.")
                        else:
                            st.write("Interpretation: The p-value is greater than 0.05, indicating no statistically significant difference between the distributions of the two groups. We fail to reject the null hypothesis that the distributions are equal.")
                else:
                    st.error(f"Column '{mann_whitney_group_column}' does not exist in the pivot table.")

                # Kruskal-Wallis Test
                st.write("### Kruskal-Wallis Test comparing groups")
                kruskal_column = st.selectbox("Select column for Kruskal-Wallis Test", ['mean_workedHours'], key='kruskal_column_tab3')
                kruskal_group_column = st.selectbox("Select grouping column for Kruskal-Wallis Test", [col for col in pivot_columns_selection if col in pivot_table_analysis.columns], key='kruskal_group_column_tab3')
                if kruskal_group_column in pivot_table_analysis.columns:
                    if st.button("Run Kruskal-Wallis Test", key='run_kruskal_wallis_test_tab3'):
                        kruskal_result = perform_kruskal_wallis_test(pivot_table_analysis, kruskal_column, kruskal_group_column)
                        st.write("Kruskal-Wallis Test Result:")
                        st.write(kruskal_result)

                        st.write(f"Kruskal-Wallis H Statistic: {kruskal_result.statistic}")
                        st.write(f"P-Value: {kruskal_result.pvalue}")
                        
                        if kruskal_result.pvalue < 0.05:
                            st.write("Interpretation: The p-value is less than 0.05, indicating a statistically significant difference between the distributions of the groups. We reject the null hypothesis that the group distributions are equal.")
                        else:
                            st.write("Interpretation: The p-value is greater than 0.05, indicating no statistically significant difference between the distributions of the groups. We fail to reject the null hypothesis that the group distributions are equal.")
                else:
                    st.error(f"Column '{kruskal_group_column}' does not exist in the pivot table.")
    else:
        st.warning("Please enter a valid file path in Tab 2.")
































# Detailed Analysis Tab
with tab4:
    st.header("Detailed Analysis")

    # Retrieve the pivot table from the "Statistical Analysis" tab
    pivot_table_analysis = st.session_state.get('pivot_table_analysis')

    if pivot_table_analysis is not None and not pivot_table_analysis.empty:
        # Display the filtered pivot table
        numeric_columns = pivot_table_analysis.select_dtypes(include='number').columns.tolist()
        if 'employeeCode' in numeric_columns:
            numeric_columns.remove('employeeCode')

        if not numeric_columns:
            st.warning("The pivot table does not contain any numeric columns for detailed analysis.")
        else:
            # Descriptive Statistics
            st.subheader("Descriptive Statistics")
            desc_column = st.selectbox("Select Column for Descriptive Statistics", numeric_columns, key='detailed_desc_column')
            if desc_column:
                desc_stats = calculate_descriptive_statistics(pivot_table_analysis, desc_column)
                st.write("Descriptive Statistics Table")
                st.write(pd.DataFrame([desc_stats]))
                st.plotly_chart(visualize_descriptive_stats(desc_stats))
                st.plotly_chart(visualize_distribution(pivot_table_analysis, desc_column))

            # Normality Test
            st.subheader("Normality Test")
            norm_column = st.selectbox("Select Column for Normality Test", numeric_columns, key='norm_column')
            if norm_column:
                stat, p_value = test_normality(pivot_table_analysis, norm_column)
                st.write("Shapiro-Wilk Test Result")
                st.write(f"Statistic: {stat}")
                st.write(f"P-Value: {p_value}")
                
                if p_value < 0.05:
                    st.write("Interpretation: The p-value is less than 0.05, indicating that the data is not normally distributed.")
                else:
                    st.write("Interpretation: The p-value is greater than 0.05, indicating that the data is normally distributed.")

            # Homogeneity of Variance Test
            st.subheader("Homogeneity of Variance Test")
            homogeneity_column = st.selectbox("Select Column for Homogeneity of Variance Test", numeric_columns, key='homogeneity_column')
            homogeneity_group_column = st.selectbox("Select Group Column for Homogeneity of Variance Test", [col for col in pivot_table_analysis.columns if col not in numeric_columns], key='homogeneity_group_column')
            if homogeneity_column and homogeneity_group_column:
                try:
                    stat, p_value = test_homogeneity_of_variance(pivot_table_analysis, homogeneity_column, homogeneity_group_column)
                    st.write("Levene's Test Result")
                    st.write(f"Statistic: {stat}")
                    st.write(f"P-Value: {p_value}")
                    
                    if p_value < 0.05:
                        st.write("Interpretation: The p-value is less than 0.05, indicating that the variances are not equal across the groups.")
                    else:
                        st.write("Interpretation: The p-value is greater than 0.05, indicating that the variances are equal across the groups.")
                except Exception as e:
                    st.error(f"Levene's Test could not be performed: {e}")
            else:
                st.error("Please select valid columns for the Homogeneity of Variance Test.")

            # Recommendations Section
            st.subheader("Recommendations")

            if norm_column and homogeneity_column:
                if p_value < 0.05:
                    st.write("Based on the results of the normality test, the data does not follow a normal distribution.")
                    if homogeneity_group_column:
                        if p_value < 0.05:
                            st.write("Since the variances are not equal across the groups, non-parametric tests such as the Mann-Whitney U Test or the Kruskal-Wallis Test are recommended.")
                        else:
                            st.write("Since the variances are equal across the groups, consider using Welch's T-Test for comparing groups.")
                    else:
                        st.write("For non-normally distributed data without group comparisons, non-parametric tests are recommended.")
                else:
                    st.write("Based on the results of the normality test, the data follows a normal distribution.")
                    if homogeneity_group_column:
                        if p_value < 0.05:
                            st.write("Since the variances are not equal across the groups, consider using Welch's T-Test for comparing groups.")
                        else:
                            st.write("Since the variances are equal across the groups, parametric tests such as ANOVA or T-Test are recommended.")
                    else:
                        st.write("For normally distributed data without group comparisons, parametric tests are recommended.")
    else:
        st.warning("Please generate a pivot table in the 'Statistical Analysis' tab.")
